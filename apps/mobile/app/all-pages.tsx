import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import withObservables from '@nozbe/with-observables';

import { db } from '@/lib/db';
import Page from '@/lib/db/models/Page';
import { useTheme, typography, spacing, radii, fonts } from '@/lib/theme';
import { PageIcon } from '@/components/ui/PageIcon';
import ActionSheetOverlay, { MenuOption } from '@/components/ui/ActionSheetOverlay';
import { FlashList } from '@shopify/flash-list';

// ─── Animated Pressable Helper ────────────────────────────────────────────────

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SpringPress({ onPress, onLongPress, style, children }: {
  onPress?: () => void;
  onLongPress?: () => void;
  style?: any;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      style={[style, animStyle]}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 150 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 150 }); }}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress?.(); }}
      onLongPress={() => { if (onLongPress) { onLongPress(); } }}
      delayLongPress={400}
    >
      {children}
    </AnimatedPressable>
  );
}

// ─── All Pages Screen ─────────────────────────────────────────────────────────

function AllPagesScreen({ pages }: { pages: Page[] }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme: { colors } } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'a-z'>('newest');

  const filteredPages = useMemo(() => {
    let result = pages;
    if (searchQuery.trim()) {
      result = result.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result.sort((a, b) => {
      if (sortOrder === 'a-z') return (a.title || '').localeCompare(b.title || '');
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [pages, searchQuery, sortOrder]);

  const [selectedPageForMenu, setSelectedPageForMenu] = useState<Page | null>(null);

  const pageMenuOptions: MenuOption[] = [
    {
      id: 'page-duplicate',
      label: 'Duplicate',
      subtitle: 'Create a copy of this page',
      icon: 'copy',
      onPress: async () => {
        if (!selectedPageForMenu) return;
        try {
          await db.write(async () => {
            await db.get<Page>('pages').create((p) => {
              p.title = (selectedPageForMenu.title || 'Untitled') + ' (Copy)';
              p.content = selectedPageForMenu.content;
              p.icon = selectedPageForMenu.icon;
              p.isFavorite = selectedPageForMenu.isFavorite;
              p.isDeleted = false;
            });
          });
        } catch (error) {
          console.error('Failed to duplicate page', error);
        }
      },
    },
    {
      id: 'page-delete',
      label: 'Delete',
      subtitle: 'Move page to trash',
      icon: 'trash-2',
      onPress: async () => {
        if (!selectedPageForMenu) return;
        try {
          await db.write(async () => {
            await selectedPageForMenu.update((p) => {
              p.isDeleted = true;
            });
          });
        } catch (error) {
          console.error('Failed to delete page', error);
        }
      },
    },
  ];

  return (
    <View style={[s.container, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <Pressable style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={24} color={colors.ink} />
        </Pressable>
        <Text style={[s.headerTitle, { color: colors.ink }]}>All Pages</Text>
        <View style={s.backBtn} />
      </View>

      {/* Toolbar */}
      <View style={s.toolbar}>
        <View style={[s.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.inkTertiary} />
          <TextInput 
            style={[s.searchInput, { color: colors.ink }]} 
            placeholder="Search pages..."
            placeholderTextColor={colors.inkTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable 
          style={[s.sortButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSortOrder(prev => prev === 'newest' ? 'a-z' : 'newest');
          }}
        >
          <Feather name={sortOrder === 'newest' ? 'clock' : 'type'} size={16} color={colors.inkSecondary} />
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        {filteredPages.length === 0 ? (
          <View style={s.emptyState}>
            <Feather name="file-text" size={48} color={colors.inkTertiary} style={{ marginBottom: spacing.md }} />
            <Text style={[s.emptyTitle, { color: colors.inkSecondary }]}>
              {pages.length === 0 ? 'No pages yet' : 'No matching pages'}
            </Text>
          </View>
        ) : (
          <FlashList
            data={filteredPages}
            contentContainerStyle={s.content}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: page }) => (
              <SpringPress
                style={[s.pageRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push(`/editor/${page.id}`)}
                onLongPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSelectedPageForMenu(page);
                }}
              >
                <PageIcon icon={page.icon} size={20} color={colors.primary || colors.inkSubtle} />
                <View style={s.pageInfo}>
                  <Text style={[s.pageTitle, { color: colors.ink }]} numberOfLines={1}>
                    {page.title || 'Untitled'}
                  </Text>
                  <Text style={[s.pageDate, { color: colors.inkTertiary }]}>
                    Edited {new Date(page.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.inkSubtle} />
              </SpringPress>
            )}
          />
        )}
      </View>

      {/* Page Actions Menu Sheet */}
      {selectedPageForMenu && (
        <ActionSheetOverlay
          onClose={() => setSelectedPageForMenu(null)}
          title={selectedPageForMenu.title || 'Untitled'}
          subtitle="Page actions"
          options={pageMenuOptions}
          colors={colors}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.body,
    fontFamily: fonts.semiBold,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  sortButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  pageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
    marginBottom: spacing.xs,
  },
  pageInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  pageTitle: {
    ...typography.bodySm,
    fontFamily: fonts.medium,
  },
  pageDate: {
    ...typography.caption,
    marginTop: 2,
  },
  emptyState: {
    paddingTop: spacing.xxl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...typography.body,
    fontFamily: fonts.medium,
  },
});

const enhance = withObservables([], () => ({
  pages: db.collections.get<Page>('pages').query().observe(),
}));

export default enhance(AllPagesScreen);
