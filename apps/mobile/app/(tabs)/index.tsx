import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Alert, Modal, TextInput, KeyboardAvoidingView, Platform,
  ActionSheetIOS, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, FadeInDown, SlideInDown, SlideOutDown, FadeIn, FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import withObservables from '@nozbe/with-observables';
import { FlashList } from '@shopify/flash-list';

import { colors, spacing, radii, typography, fonts, useTheme } from '@/lib/theme';
import { db } from '@/lib/db';
import Page from '@/lib/db/models/Page';
import Project from '@/lib/db/models/Project';
import { sync } from '@/lib/db/sync';
import { PageIcon } from '@/components/ui/PageIcon';
import ActionSheetOverlay, { MenuOption } from '@/components/ui/ActionSheetOverlay';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getRelativeTime(date: number | Date) {
  if (!date) return '';
  const diffInSeconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function getFormattedDate(date: Date) {
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function extractPreview(content?: string): string {
  if (!content) return 'No additional content';
  try {
    const json = JSON.parse(content);
    let text = '';
    const extractText = (node: any) => {
      if (node.type === 'text' && node.text) {
        text += node.text + ' ';
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(extractText);
      }
    };
    extractText(json);
    return text.trim() || 'Empty page';
  } catch (e) {
    return content.replace(/<[^>]+>/g, '').trim() || 'Empty page';
  }
}

// ── HomeScreen ───────────────────────────────────────────────────────────────

// ── Animated Pressable ────────────────────────────────────────────────────────

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SpringButton({ onPress, style, children }: {
  onPress: () => void;
  style?: any;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 150 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 150 }); }}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
    >
      {children}
    </AnimatedPressable>
  );
}

// ── Create Project Modal ──────────────────────────────────────────────────────

const PROJECT_COLORS = [
  '#5e6ad2', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6', '#a855f7',
  '#ec4899', '#64748b',
];

function CreateProjectModal({ visible, onClose, colors: c }: {
  visible: boolean;
  onClose: () => void;
  colors: any;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const reset = () => { setName(''); setDescription(''); setSelectedColor(PROJECT_COLORS[0]); };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await db.write(async () => {
        await db.get<Project>('projects').create((p) => {
          p.name = name.trim();
          p.color = selectedColor;
          p.description = description.trim() || undefined;
        });
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      reset();
      onClose();
    } catch (err) {
      console.error('Failed to create project:', err);
      Alert.alert('Error', 'Could not create project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: c.canvas }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[pm.header, { borderBottomColor: c.border }]}>
          <Pressable onPress={() => { reset(); onClose(); }} style={pm.headerBtn}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: c.inkSubtle }}>Cancel</Text>
          </Pressable>
          <Text style={[pm.headerTitle, { color: c.ink }]}>New Project</Text>
          <Pressable
            onPress={handleCreate}
            disabled={!name.trim() || saving}
            style={[pm.saveBtn, { backgroundColor: c.accent, opacity: !name.trim() || saving ? 0.4 : 1 }]}
          >
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 15, color: c.onAccent }}>
              {saving ? 'Creating…' : 'Create'}
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={pm.body} keyboardShouldPersistTaps="handled">
          {/* Color preview + name */}
          <View style={[pm.previewRow, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={[pm.colorDot, { backgroundColor: selectedColor }]} />
            <TextInput
              style={[pm.nameInput, { color: c.ink }]}
              placeholder="Project name"
              placeholderTextColor={c.inkTertiary}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="next"
            />
          </View>

          {/* Description */}
          <TextInput
            style={[pm.descInput, { color: c.ink, backgroundColor: c.surface, borderColor: c.border }]}
            placeholder="Description (optional)"
            placeholderTextColor={c.inkTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Color picker */}
          <Text style={[pm.fieldLabel, { color: c.inkSubtle }]}>Color</Text>
          <View style={pm.colorGrid}>
            {PROJECT_COLORS.map((col) => (
              <Pressable
                key={col}
                onPress={() => setSelectedColor(col)}
                style={[pm.colorSwatch, { backgroundColor: col, borderWidth: selectedColor === col ? 3 : 0, borderColor: c.ink }]}
              />
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────

interface HomeScreenProps {
  pages: Page[];
  projects: Project[];
}

function HomeScreen({ pages, projects }: HomeScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { theme } = useTheme();
  const activeColors = theme.colors;

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const greeting = getGreeting();
  const firstName = user?.firstName || 'User';
  const initial = firstName.charAt(0).toUpperCase();
  const workspaceName = `${initial}'s Workspace`;

  // Sort pages newest-first, exclude deleted
  const sortedPages = [...pages]
    .filter((p) => !p.isDeleted)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const recentPages = sortedPages.slice(0, 4);
  const allPages = sortedPages.slice(4);

  const [refreshing, setRefreshing] = useState(false);
  const [isInitialSyncing, setIsInitialSyncing] = useState(true);
  const [selectedPageForMenu, setSelectedPageForMenu] = useState<Page | null>(null);

  useFocusEffect(
    useCallback(() => {
      sync(getToken)
        .catch(console.error)
        .finally(() => setIsInitialSyncing(false));
    }, [getToken])
  );
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await sync(getToken);
    } catch (error) {
      console.error('Refresh sync failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [getToken]);

  // ── Workspace header menu ─────────────────────────────────────────────────
  const handleWorkspacePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowWorkspaceMenu(true);
  };

  // ── Three-dot context menu ────────────────────────────────────────────────
  const handleMorePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMoreMenu(true);
  };

  const workspaceOptions: MenuOption[] = [
    {
      id: 'ws-current',
      label: workspaceName,
      subtitle: 'Active Workspace',
      icon: 'briefcase',
      selected: true,
      onPress: () => {},
    },
    {
      id: 'ws-profile',
      label: 'Manage Profile',
      subtitle: 'Edit profile & account info',
      icon: 'user',
      onPress: () => router.push('/profile'),
    },
  ];

  const moreOptions: MenuOption[] = [
    {
      id: 'more-settings',
      label: 'Settings',
      subtitle: 'App preferences & settings',
      icon: 'settings',
      onPress: () => router.push('/(tabs)/settings'),
    },
    {
      id: 'more-appearance',
      label: 'Appearance',
      subtitle: 'Dark mode & theme tokens',
      icon: 'moon',
      onPress: () => router.push('/appearance'),
    },
  ];

  // ── Create new page ───────────────────────────────────────────────────────
  const handleNewPage = async () => {
    try {
      let newId = '';
      await db.write(async () => {
        const newPage = await db.get<Page>('pages').create((p) => {
          p.title = 'Untitled';
          p.content = '';
          p.isFavorite = false;
          p.isDeleted = false;
        });
        newId = newPage.id;
      });
      if (newId) router.push(`/editor/${newId}`);
    } catch (error) {
      console.error('Failed to create page', error);
    }
  };

  // ── Page Actions Menu ───────────────────────────────────────────────────────
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
    <View style={[s.container, { paddingTop: insets.top, backgroundColor: activeColors.canvas }]}>
      <FlashList
        data={allPages}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={activeColors.inkTertiary}
            colors={[activeColors.accent]}
          />
        }
        ListHeaderComponent={
          <>
            {/* ── Header ── */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={s.header}>
          {/* Workspace selector */}
          <Pressable style={s.headerLeft} onPress={handleWorkspacePress}>
            <Text style={[s.workspaceName, { color: activeColors.ink }]}>{workspaceName}</Text>
            <Feather name="chevron-down" size={14} color={activeColors.inkTertiary} />
          </Pressable>

          {/* Three-dot menu — notification icon dihapus */}
          <Pressable style={s.iconButton} onPress={handleMorePress}>
            <Feather name="more-horizontal" size={20} color={activeColors.inkSecondary} />
          </Pressable>
        </Animated.View>

        {/* ── Greeting ── */}
        <Animated.View entering={FadeInDown.delay(50).springify()} style={s.greetingContainer}>
          <Text style={[s.greetingText, { color: activeColors.ink }]}>
            {greeting}, {firstName}
          </Text>
        </Animated.View>

        {/* ── Quick Actions ── */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={s.quickActions}>
          {/* New Page */}
          <SpringButton
            style={[s.actionCard, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}
            onPress={handleNewPage}
          >
            <Feather name="file-plus" size={20} color={activeColors.accent} style={s.actionIcon} />
            <Text style={[s.actionLabel, { color: activeColors.ink }]}>New page</Text>
          </SpringButton>

          {/* New Project */}
          <SpringButton
            style={[s.actionCard, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}
            onPress={() => setShowCreateProject(true)}
          >
            <Feather name="folder-plus" size={20} color={activeColors.accent} style={s.actionIcon} />
            <Text style={[s.actionLabel, { color: activeColors.ink }]}>New project</Text>
          </SpringButton>
        </Animated.View>

        {/* ── Empty / Loading State ── */}
        {isInitialSyncing && sortedPages.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(150).springify()} style={{ padding: spacing.xxl, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={activeColors.inkTertiary} />
            <Text style={{ marginTop: spacing.md, color: activeColors.inkTertiary, ...typography.bodySm }}>
              Syncing workspace...
            </Text>
          </Animated.View>
        ) : sortedPages.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(150).springify()} style={{ padding: spacing.xxl, alignItems: 'center' }}>
            <Feather name="file-text" size={48} color={activeColors.border} style={{ marginBottom: spacing.md }} />
            <Text style={{ color: activeColors.inkSecondary, ...typography.bodySm, marginBottom: spacing.xs }}>
              No pages yet
            </Text>
            <Text style={{ color: activeColors.inkTertiary, ...typography.caption, textAlign: 'center' }}>
              Create your first page to start taking notes.
            </Text>
          </Animated.View>
        ) : null}

        {/* ── Jump back in ── */}
        {recentPages.length > 0 && (
          <Animated.View entering={FadeInDown.delay(150).springify()} style={s.section}>
            <Text style={[s.sectionHeader, { color: activeColors.inkSubtle }]}>Jump back in</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.recentScroll}>
              {recentPages.map((page) => (
                <Pressable
                  key={page.id}
                  style={({ pressed }) => [
                    s.linearRecentCard, 
                    { backgroundColor: pressed ? activeColors.surfaceHover : activeColors.surface, borderColor: activeColors.border }
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/editor/${page.id}`);
                  }}
                  onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setSelectedPageForMenu(page);
                  }}
                  delayLongPress={250}
                >
                  <View style={s.linearRecentTop}>
                    <PageIcon icon={page.icon} size={16} color={activeColors.inkSecondary} />
                    <Text style={[s.gridTime, { color: activeColors.inkTertiary }]}>
                      {getRelativeTime(page.updatedAt)}
                    </Text>
                  </View>
                  <View style={s.linearRecentBottom}>
                    <Text style={[s.linearRecentTitle, { color: activeColors.ink }]} numberOfLines={1}>
                      {page.title || 'Untitled'}
                    </Text>
                    <Text style={[s.linearRecentPreview, { color: activeColors.inkTertiary }]} numberOfLines={2}>
                      {extractPreview(page.content)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── All Pages ── */}
        {allPages.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={s.section}>
            <View style={s.sectionHeaderRow}>
              <Text style={[s.sectionHeader, { color: activeColors.inkSubtle }]}>All pages</Text>
              <Pressable onPress={() => router.push('/all-pages')}>
                <Text style={[s.seeAllText, { color: activeColors.inkTertiary }]}>See all →</Text>
              </Pressable>
            </View>
            <View style={{ height: 1, backgroundColor: activeColors.borderSubtle, marginTop: spacing.sm }} />
          </Animated.View>
        )}
      </>
    }
    renderItem={({ item: page }) => (
      <Pressable
        key={page.id}
        style={({ pressed }) => [s.listRow, pressed && { backgroundColor: activeColors.surfaceHover }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push(`/editor/${page.id}`);
        }}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setSelectedPageForMenu(page);
        }}
        delayLongPress={250}
      >
        <View style={s.listRowLeft}>
          <PageIcon icon={page.icon} size={17} color={activeColors.inkTertiary} />
          <Text style={[s.listTitle, { color: activeColors.ink }]} numberOfLines={1}>
            {page.title || 'Untitled'}
          </Text>
        </View>
        <Text style={[s.listDate, { color: activeColors.inkTertiary }]}>
          {getFormattedDate(page.updatedAt)}
        </Text>
      </Pressable>
    )}
  />

      {/* Create Project Modal */}
      <CreateProjectModal
        visible={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        colors={activeColors}
      />

      {/* Workspace Menu Sheet */}
      {showWorkspaceMenu && (
        <ActionSheetOverlay
          onClose={() => setShowWorkspaceMenu(false)}
          title="Workspace"
          subtitle="Select or manage your workspace"
          options={workspaceOptions}
          colors={activeColors}
        />
      )}

      {/* More Options Menu Sheet */}
      {showMoreMenu && (
        <ActionSheetOverlay
          onClose={() => setShowMoreMenu(false)}
          title="Quick Actions"
          options={moreOptions}
          colors={activeColors}
        />
      )}

      {/* Page Actions Menu Sheet */}
      {selectedPageForMenu && (
        <ActionSheetOverlay
          onClose={() => setSelectedPageForMenu(null)}
          title={selectedPageForMenu.title || 'Untitled'}
          subtitle="Page actions"
          options={pageMenuOptions}
          colors={activeColors}
        />
      )}
    </View>
  );
}

// ── WatermelonDB observable ───────────────────────────────────────────────────

const enhance = withObservables([], () => ({
  pages: db.collections.get<Page>('pages').query().observe(),
  projects: db.collections.get<Project>('projects').query().observe(),
}));

export default enhance(HomeScreen);

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.semiBold, fontSize: 14 },
  workspaceName: { ...typography.headline, color: colors.ink },
  iconButton: { padding: spacing.xs },

  // Greeting
  greetingContainer: { marginBottom: spacing.lg },
  greetingText: { fontFamily: fonts.semiBold, fontSize: 24, color: colors.ink },

  // Quick Actions
  quickActions: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xxl },
  actionCard: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
    padding: spacing.md,
  },
  actionIcon: { marginBottom: spacing.sm },
  actionLabel: { fontFamily: fonts.medium, fontSize: 14 },

  // Sections
  section: { marginBottom: spacing.xxl },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionHeader: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  seeAllText: { fontFamily: fonts.medium, fontSize: 14 },

  // Recent horizontal scroll cards
  recentScroll: { gap: spacing.xs, paddingBottom: spacing.sm },
  linearRecentCard: {
    width: 240,
    height: 110,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
    justifyContent: 'space-between',
  },
  linearRecentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linearRecentBottom: {
    marginTop: 'auto',
  },
  linearRecentTitle: {
    ...typography.bodySm,
    fontFamily: fonts.semiBold,
  },
  linearRecentPreview: {
    ...typography.caption,
    marginTop: 2,
    lineHeight: 16,
  },
  gridTime: { fontFamily: fonts.regular, fontSize: 12 },

  // All pages list
  listContainer: { borderTopWidth: StyleSheet.hairlineWidth },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  listRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.sm },
  listTitle: { fontFamily: fonts.regular, fontSize: 15, flex: 1 },
  listDate: { fontFamily: fonts.regular, fontSize: 12 },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.semiBold, fontSize: 17, marginBottom: spacing.xs },
  emptySubtitle: { fontFamily: fonts.regular, fontSize: 14 },
});

// ── Create Project Modal Styles ───────────────────────────────────────────────

const pm = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  headerTitle: { fontFamily: fonts.semiBold, fontSize: 16 },
  saveBtn: { paddingVertical: 6, paddingHorizontal: spacing.md, borderRadius: 0 },
  body: { padding: spacing.lg, gap: spacing.md },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  colorDot: { width: 16, height: 16, borderRadius: 0 },
  nameInput: { fontFamily: fonts.semiBold, fontSize: 18, flex: 1 },
  descInput: {
    fontFamily: fonts.regular,
    fontSize: 15,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
    minHeight: 80,
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 0,
  },
});
