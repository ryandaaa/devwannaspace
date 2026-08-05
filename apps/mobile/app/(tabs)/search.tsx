import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { FlashList } from '@shopify/flash-list';
import withObservables from '@nozbe/with-observables';
import { useRouter } from 'expo-router';

import { colors, spacing, radii, typography, fonts, shadows, useTheme } from '@/lib/theme';
import { db } from '@/lib/db';
import Page from '@/lib/db/models/Page';
import Project from '@/lib/db/models/Project';
import Issue from '@/lib/db/models/Issue';

// ── Section: Animated Pressable ──
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ScalePressable({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: any }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) onPress();
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ── Section: Search Screen ──
function SearchScreen({ pages = [], projects = [], issues = [] }: { pages: Page[], projects: Project[], issues: Issue[] }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = theme.colors;
  const activeColors = theme.colors;
  const [query, setQuery] = useState('');

  const recentSearches = ['Guide', 'API', 'Components'];

  const filteredPages = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return pages.filter(p => p.title?.toLowerCase().includes(lowerQuery) || p.content?.toLowerCase().includes(lowerQuery));
  }, [pages, query]);

  const filteredProjects = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return projects.filter(p => p.name?.toLowerCase().includes(lowerQuery) || p.description?.toLowerCase().includes(lowerQuery));
  }, [projects, query]);

  const filteredIssues = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return issues.filter(i => i.title?.toLowerCase().includes(lowerQuery) || i.description?.toLowerCase().includes(lowerQuery));
  }, [issues, query]);

  const starredCount = useMemo(() => pages.filter(p => p.isStarred).length, [pages]);

  return (
    <View style={[s.container, { paddingTop: insets.top, backgroundColor: activeColors.canvas }]}>
      {/* ── Search Bar ── */}
      <View style={[s.searchBarContainer, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}>
        <Feather name="search" size={18} color={activeColors.inkTertiary} style={s.searchIcon} />
        <TextInput
          style={[s.searchInput, { color: activeColors.ink }]}
          placeholder="Search..."
          placeholderTextColor={activeColors.inkTertiary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={12} style={s.clearBtn}>
            <Feather name="x" size={16} color={colors.inkTertiary} />
          </Pressable>
        )}
      </View>

      {query.length === 0 ? (
        <ScrollView style={s.content} contentContainerStyle={s.contentContainer} keyboardShouldPersistTaps="handled">
          {/* ── Recent Searches ── */}
          <Text style={[s.sectionTitle, { color: colors.inkSubtle }]}>Recent searches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.recentList}>
            {recentSearches.map((term, index) => (
              <ScalePressable key={index} style={[s.chip, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setQuery(term)}>
                <Text style={[s.chipText, { color: colors.ink }]}>{term}</Text>
              </ScalePressable>
            ))}
          </ScrollView>

          {/* ── Browse ── */}
          <Text style={[s.sectionTitle, { color: colors.inkSubtle }]}>Browse</Text>
          <View style={[s.menuBlock, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}>
            <ScalePressable style={[s.menuItem, { borderBottomColor: activeColors.border }]} onPress={() => router.push('/all-pages')}>
              <View style={s.menuItemLeft}>
                <Feather name="file-text" size={18} color={activeColors.inkSecondary} style={s.menuIcon} />
                <Text style={[s.menuTitle, { color: activeColors.ink }]}>All Pages</Text>
              </View>
              <View style={s.menuItemRight}>
                <Text style={[s.menuCount, { color: activeColors.inkTertiary }]}>{pages.length}</Text>
                <Feather name="chevron-right" size={16} color={activeColors.inkTertiary} />
              </View>
            </ScalePressable>
            
            <ScalePressable style={[s.menuItem, { borderBottomColor: activeColors.border }]} onPress={() => router.push('/(tabs)/projects')}>
              <View style={s.menuItemLeft}>
                <Feather name="folder" size={18} color={activeColors.inkSecondary} style={s.menuIcon} />
                <Text style={[s.menuTitle, { color: activeColors.ink }]}>Projects</Text>
              </View>
              <View style={s.menuItemRight}>
                <Text style={[s.menuCount, { color: activeColors.inkTertiary }]}>{projects.length}</Text>
                <Feather name="chevron-right" size={16} color={activeColors.inkTertiary} />
              </View>
            </ScalePressable>

            <ScalePressable style={[s.menuItem, { borderBottomColor: activeColors.border }]} onPress={() => router.push('/(tabs)/favorites')}>
              <View style={s.menuItemLeft}>
                <Feather name="star" size={18} color={activeColors.inkSecondary} style={s.menuIcon} />
                <Text style={[s.menuTitle, { color: activeColors.ink }]}>Starred</Text>
              </View>
              <View style={s.menuItemRight}>
                <Text style={[s.menuCount, { color: activeColors.inkTertiary }]}>{starredCount}</Text>
                <Feather name="chevron-right" size={16} color={activeColors.inkTertiary} />
              </View>
            </ScalePressable>

            <ScalePressable style={[s.menuItem, { borderBottomWidth: 0 }]} onPress={() => router.push('/(tabs)/projects')}>
              <View style={s.menuItemLeft}>
                <Feather name="check-circle" size={18} color={activeColors.inkSecondary} style={s.menuIcon} />
                <Text style={[s.menuTitle, { color: activeColors.ink }]}>Issues</Text>
              </View>
              <View style={s.menuItemRight}>
                <Text style={[s.menuCount, { color: activeColors.inkTertiary }]}>{issues.length}</Text>
                <Feather name="chevron-right" size={16} color={activeColors.inkTertiary} />
              </View>
            </ScalePressable>
          </View>
        </ScrollView>
      ) : (
        /* ── Search Results ── */
        <ScrollView style={[s.resultsContainer, { backgroundColor: activeColors.canvas }]} contentContainerStyle={s.contentContainer} keyboardShouldPersistTaps="handled">
          {filteredPages.length === 0 && filteredProjects.length === 0 && filteredIssues.length === 0 && (
             <Text style={[s.emptyText, { color: activeColors.inkTertiary, marginTop: spacing.xl, textAlign: 'center' }]}>No results found for "{query}"</Text>
          )}

          {filteredPages.length > 0 && (
             <>
               <Text style={[s.resultsHeader, { color: activeColors.inkSubtle }]}>Pages</Text>
               {filteredPages.map((item, index) => (
                  <Animated.View key={item.id} entering={FadeInDown.delay(index * 30)}>
                    <ScalePressable onPress={() => router.push(`/editor/${item.id}`)} style={[s.resultRow, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}>
                      <Feather name="file-text" size={18} color={activeColors.inkSubtle} />
                      <Text style={[s.resultTitle, { color: activeColors.ink }]} numberOfLines={1}>{item.title || 'Untitled'}</Text>
                      <Text style={[s.resultDate, { color: activeColors.inkTertiary }]}>
                        {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : ''}
                      </Text>
                    </ScalePressable>
                  </Animated.View>
               ))}
             </>
          )}

          {filteredProjects.length > 0 && (
             <>
               <Text style={[s.resultsHeader, { color: activeColors.inkSubtle, marginTop: filteredPages.length > 0 ? spacing.xl : spacing.md }]}>Projects</Text>
               {filteredProjects.map((item, index) => (
                  <Animated.View key={item.id} entering={FadeInDown.delay(index * 30)}>
                    <ScalePressable onPress={() => router.push(`/project/${item.id}`)} style={[s.resultRow, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}>
                      <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: item.color || activeColors.accent }} />
                      <Text style={[s.resultTitle, { color: activeColors.ink, marginLeft: 8 }]} numberOfLines={1}>{item.name}</Text>
                    </ScalePressable>
                  </Animated.View>
               ))}
             </>
          )}

          {filteredIssues.length > 0 && (
             <>
               <Text style={[s.resultsHeader, { color: activeColors.inkSubtle, marginTop: filteredProjects.length > 0 || filteredPages.length > 0 ? spacing.xl : spacing.md }]}>Issues</Text>
               {filteredIssues.map((item, index) => (
                  <Animated.View key={item.id} entering={FadeInDown.delay(index * 30)}>
                    <ScalePressable onPress={() => router.push(`/issue/${item.id}`)} style={[s.resultRow, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}>
                      <Feather name="check-circle" size={18} color={activeColors.inkSubtle} />
                      <Text style={[s.resultTitle, { color: activeColors.ink }]} numberOfLines={1}>{item.title}</Text>
                      <Text style={[s.resultDate, { color: activeColors.inkTertiary }]}>{item.status}</Text>
                    </ScalePressable>
                  </Animated.View>
               ))}
             </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// ── Section: Styles ──
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.md,
    height: 44,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: 16,
    height: '100%',
  },
  clearBtn: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.eyebrow,
    color: colors.inkSubtle,
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  recentList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: spacing.sm,
  },
  chipText: {
    ...typography.bodySm,
    color: colors.ink,
  },
  menuBlock: {
    marginHorizontal: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: spacing.md,
  },
  menuTitle: {
    ...typography.body,
    fontFamily: fonts.medium,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  menuCount: {
    ...typography.bodySm,
  },
  cardTitle: {
    ...typography.body,
    fontFamily: fonts.medium,
    color: colors.ink,
    marginBottom: spacing.xxs,
  },
  cardCount: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  resultsHeader: {
    ...typography.eyebrow,
    color: colors.inkSubtle,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  resultTitle: {
    ...typography.body,
    color: colors.ink,
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  resultDate: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  emptyText: {
    ...typography.body,
    color: colors.inkTertiary,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
});

const enhance = withObservables([], () => ({
  pages: db.collections.get('pages').query().observe(),
  projects: db.collections.get('projects').query().observe(),
  issues: db.collections.get('issues').query().observe(),
}));

export default enhance(SearchScreen as any);
