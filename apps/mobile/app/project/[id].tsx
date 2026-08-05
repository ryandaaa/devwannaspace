import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Alert,
  TextInput, Modal, ScrollView, KeyboardAvoidingView, Platform,
  ActionSheetIOS,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import withObservables from '@nozbe/with-observables';
import Animated, {
  FadeInDown, useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';

import { db } from '@/lib/db';
import { Q } from '@nozbe/watermelondb';
import Project from '@/lib/db/models/Project';
import Page from '@/lib/db/models/Page';
import Issue from '@/lib/db/models/Issue';
import { useTheme, typography, spacing, radii, fonts } from '@/lib/theme';

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES = ['Todo', 'In Progress', 'Done', 'Canceled'] as const;
const PRIORITIES = ['No Priority', 'Low', 'Medium', 'High', 'Urgent'] as const;
type Status = typeof STATUSES[number];
type Priority = typeof PRIORITIES[number];

const STATUS_COLORS: Record<Status, string> = {
  'Todo': '#8a8f98',
  'In Progress': '#5e6ad2',
  'Done': '#27a644',
  'Canceled': '#62666d',
};
const STATUS_ICONS: Record<Status, keyof typeof Feather.glyphMap> = {
  'Todo': 'circle',
  'In Progress': 'loader',
  'Done': 'check-circle',
  'Canceled': 'x-circle',
};
const PRIORITY_ICONS: Record<Priority, keyof typeof Feather.glyphMap> = {
  'No Priority': 'minus',
  'Low': 'arrow-down',
  'Medium': 'minus',
  'High': 'arrow-up',
  'Urgent': 'alert-circle',
};
const PRIORITY_COLORS: Record<Priority, string> = {
  'No Priority': '#62666d',
  'Low': '#8a8f98',
  'Medium': '#d97706',
  'High': '#ef4444',
  'Urgent': '#dc2626',
};

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
      onLongPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onLongPress?.(); }}
    >
      {children}
    </AnimatedPressable>
  );
}

// ─── Link Page Modal ──────────────────────────────────────────────────────────

function LinkPageModal({ visible, projectId, onClose, colors }: { visible: boolean; projectId: string; onClose: () => void; colors: any; }) {
  const [pages, setPages] = useState<Page[]>([]);

  React.useEffect(() => {
    if (visible) {
      db.collections.get<Page>('pages')
        .query(Q.where('project_id', Q.notEq(projectId)))
        .fetch()
        .then(setPages);
    }
  }, [visible, projectId]);

  const handleLink = async (page: Page) => {
    try {
      await db.write(async () => {
        await page.update(p => {
          (p as any).projectId = projectId;
        });
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.canvas }}>
        <View style={[ms.modalHeader, { borderBottomColor: colors.border }]}>
          <Text style={[ms.modalTitle, { color: colors.ink }]}>Link Existing Page</Text>
          <Pressable onPress={onClose} style={ms.modalClose}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.inkSubtle }}>Cancel</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          {pages.length === 0 ? (
            <Text style={{ color: colors.inkTertiary, textAlign: 'center', marginTop: spacing.xl, fontFamily: fonts.medium }}>No other pages found.</Text>
          ) : (
            pages.map(page => (
              <Pressable 
                key={page.id} 
                style={[ms.issueRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleLink(page)}
              >
                <Feather name="file-text" size={20} color={colors.inkSecondary} />
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={[ms.issueTitle, { color: colors.ink }]} numberOfLines={1}>{page.title || 'Untitled'}</Text>
                  <Text style={[ms.issueDesc, { color: colors.inkTertiary }]}>Edited {new Date(page.updatedAt).toLocaleDateString()}</Text>
                </View>
                <Feather name="plus" size={20} color={colors.accent} />
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Create Issue Modal ───────────────────────────────────────────────────────

function CreateIssueModal({
  visible,
  projectId,
  onClose,
  colors,
}: {
  visible: boolean;
  projectId: string;
  onClose: () => void;
  colors: any;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>('Todo');
  const [priority, setPriority] = useState<Priority>('No Priority');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitle('');
    setDescription('');
    setStatus('Todo');
    setPriority('No Priority');
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await db.write(async () => {
        await db.get<Issue>('issues').create((issue) => {
          issue.title = title.trim();
          issue.description = description.trim();
          issue.status = status;
          issue.priority = priority;
          (issue as any).projectId = projectId;
        });
      });
      reset();
      onClose();
    } catch (err) {
      console.error('Failed to create issue:', err);
      Alert.alert('Error', 'Could not create issue. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.canvas }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Modal Header */}
        <View style={[ms.modalHeader, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => { reset(); onClose(); }} style={ms.modalClose}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.inkSubtle }}>Cancel</Text>
          </Pressable>
          <Text style={[ms.modalTitle, { color: colors.ink }]}>New Issue</Text>
          <Pressable
            onPress={handleCreate}
            disabled={!title.trim() || saving}
            style={[ms.modalSave, { opacity: !title.trim() || saving ? 0.4 : 1, backgroundColor: colors.accent }]}
          >
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 15, color: colors.onAccent }}>
              {saving ? 'Saving…' : 'Create'}
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={ms.modalBody} keyboardShouldPersistTaps="handled">
          {/* Title */}
          <TextInput
            style={[ms.titleInput, { color: colors.ink, borderBottomColor: colors.border }]}
            placeholder="Issue title"
            placeholderTextColor={colors.inkTertiary}
            value={title}
            onChangeText={setTitle}
            autoFocus
            returnKeyType="next"
          />

          {/* Description */}
          <TextInput
            style={[ms.descInput, { color: colors.ink, borderBottomColor: colors.border }]}
            placeholder="Description (optional)"
            placeholderTextColor={colors.inkTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Status */}
          <Text style={[ms.fieldLabel, { color: colors.inkSubtle }]}>Status</Text>
          <View style={ms.chipRow}>
            {STATUSES.map((s) => (
              <Pressable
                key={s}
                onPress={() => setStatus(s)}
                style={[
                  ms.chip,
                  { borderColor: status === s ? STATUS_COLORS[s] : colors.border },
                  status === s && { backgroundColor: STATUS_COLORS[s] + '20' },
                ]}
              >
                <Feather name={STATUS_ICONS[s]} size={12} color={STATUS_COLORS[s]} style={{ marginRight: 4 }} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: STATUS_COLORS[s] }}>{s}</Text>
              </Pressable>
            ))}
          </View>

          {/* Priority */}
          <Text style={[ms.fieldLabel, { color: colors.inkSubtle }]}>Priority</Text>
          <View style={ms.chipRow}>
            {PRIORITIES.map((p) => (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  ms.chip,
                  { borderColor: priority === p ? PRIORITY_COLORS[p] : colors.border },
                  priority === p && { backgroundColor: PRIORITY_COLORS[p] + '20' },
                ]}
              >
                <Feather name={PRIORITY_ICONS[p]} size={12} color={PRIORITY_COLORS[p]} style={{ marginRight: 4 }} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: PRIORITY_COLORS[p] }}>{p}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Issue Row ────────────────────────────────────────────────────────────────

function IssueRow({ issue, index, colors }: { issue: Issue; index: number; colors: any }) {
  const router = useRouter();
  
  const cycleStatus = async () => {
    const idx = STATUSES.indexOf(issue.status as Status);
    const next = STATUSES[(idx + 1) % STATUSES.length];
    try {
      await db.write(async () => {
        await issue.update((i) => { i.status = next; });
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Issue', `Delete "${issue.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await db.write(async () => { await issue.destroyPermanently(); });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (err) {
            console.error('Failed to delete issue:', err);
          }
        },
      },
    ]);
  };

  const status = (issue.status || 'Todo') as Status;
  const priority = (issue.priority || 'No Priority') as Priority;
  const statusColor = STATUS_COLORS[status] ?? '#8a8f98';
  const priorityColor = PRIORITY_COLORS[priority] ?? '#62666d';

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify()}>
      <SpringPress
        style={[ms.issueRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => router.push(`/issue/${issue.id}`)}
        onLongPress={handleDelete}
      >
        {/* Status icon */}
        <Pressable onPress={cycleStatus} style={ms.statusBtn} hitSlop={8}>
          <Feather name={STATUS_ICONS[status]} size={20} color={statusColor} />
        </Pressable>

        {/* Content */}
        <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
          <Text
            style={[ms.issueTitle, { color: colors.ink, textDecorationLine: status === 'Done' || status === 'Canceled' ? 'line-through' : 'none' }]}
            numberOfLines={1}
          >
            {issue.title}
          </Text>
          {!!issue.description && (
            <Text style={[ms.issueDesc, { color: colors.inkTertiary }]} numberOfLines={1}>
              {issue.description}
            </Text>
          )}
        </View>

        {/* Priority badge */}
        <View style={[ms.priorityBadge, { borderColor: priorityColor + '60' }]}>
          <Feather name={PRIORITY_ICONS[priority]} size={11} color={priorityColor} />
        </View>
      </SpringPress>
    </Animated.View>
  );
}

// ─── Project Screen ───────────────────────────────────────────────────────────

interface ProjectScreenProps {
  project: Project;
  pages: Page[];
  issues: Issue[];
}

const ProjectScreen = ({ project, pages, issues }: ProjectScreenProps) => {
  const { theme: { colors } } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pages' | 'issues'>('pages');
  const [showCreateIssue, setShowCreateIssue] = useState(false);
  const [showLinkPage, setShowLinkPage] = useState(false);

  const handleCreatePage = async () => {
    try {
      let newId = '';
      await db.write(async () => {
        const newPage = await db.get<Page>('pages').create((p) => {
          p.title = 'Untitled';
          p.content = '';
          p.isFavorite = false;
          p.isDeleted = false;
          (p as any).projectId = project.id;
        });
        newId = newPage.id;
      });
      if (newId) router.push(`/editor/${newId}`);
    } catch (err) {
      console.error('Failed to create page:', err);
    }
  };

  return (
    <View style={[s.container, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <Pressable style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={24} color={colors.ink} />
        </Pressable>
        <View style={s.titleContainer}>
          <View style={[s.colorDot, { backgroundColor: project.color || colors.accent }]} />
          <Text style={[s.headerTitle, { color: colors.ink }]} numberOfLines={1}>{project.name}</Text>
        </View>
        <Pressable
          style={s.backBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (activeTab === 'issues') {
              setShowCreateIssue(true);
            } else {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ['Cancel', 'Create New Page', 'Link Existing Page'],
                  cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                  if (buttonIndex === 1) handleCreatePage();
                  if (buttonIndex === 2) setShowLinkPage(true);
                }
              );
            }
          }}
        >
          <Feather name="plus" size={24} color={colors.accent} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={[s.tabRow, { borderBottomColor: colors.border }]}>
        {(['pages', 'issues'] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[s.tabBtn, activeTab === tab && { borderBottomColor: colors.ink }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              s.tabText,
              { color: activeTab === tab ? colors.ink : colors.inkSubtle },
              activeTab === tab && { fontFamily: fonts.semiBold },
            ]}>
              {tab === 'pages' ? `Pages (${pages.length})` : `Issues (${issues.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <View style={s.content}>
        {activeTab === 'pages' ? (
          pages.length > 0 ? (
            <FlashList
              data={pages}
              numColumns={2}
              contentContainerStyle={{ padding: spacing.sm }}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInDown.delay(index * 20).springify()} style={{ flex: 1, padding: 6 }}>
                  <SpringPress
                    style={[s.bentoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => router.push(`/editor/${item.id}`)}
                  >
                    <View style={s.bentoIcon}>
                      <Feather name="file-text" size={24} color={colors.primary || colors.accent} />
                    </View>
                    <View>
                      <Text style={[s.bentoTitle, { color: colors.ink }]} numberOfLines={2}>
                        {item.title || 'Untitled'}
                      </Text>
                      <Text style={[s.bentoSub, { color: colors.inkTertiary }]}>
                        Edited {new Date(item.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </SpringPress>
                </Animated.View>
              )}
            />
          ) : (
            <View style={s.emptyState}>
              <Feather name="file" size={44} color={colors.inkTertiary} style={{ marginBottom: spacing.md }} />
              <Text style={[s.emptyTitle, { color: colors.inkSecondary }]}>No pages yet</Text>
              <Pressable
                onPress={handleCreatePage}
                style={[s.emptyBtn, { borderColor: colors.border }]}
              >
                <Feather name="plus" size={14} color={colors.inkSubtle} style={{ marginRight: 6 }} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.inkSubtle }}>New page</Text>
              </Pressable>
            </View>
          )
        ) : (
          issues.length > 0 ? (
            <ScrollView contentContainerStyle={{ padding: spacing.md }}>
              {STATUSES.map(status => {
                const group = issues.filter(i => (i.status || 'Todo') === status);
                if (group.length === 0) return null;
                return (
                  <View key={status} style={{ marginBottom: spacing.xl }}>
                    <View style={s.statusHeader}>
                      <Feather name={STATUS_ICONS[status]} size={16} color={STATUS_COLORS[status]} />
                      <Text style={[s.statusTitle, { color: colors.ink }]}>{status}</Text>
                      <View style={[s.statusCount, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.inkSubtle }}>{group.length}</Text>
                      </View>
                    </View>
                    {group.map((item, index) => (
                      <IssueRow key={item.id} issue={item} index={index} colors={colors} />
                    ))}
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View style={s.emptyState}>
              <Feather name="check-circle" size={44} color={colors.inkTertiary} style={{ marginBottom: spacing.md }} />
              <Text style={[s.emptyTitle, { color: colors.inkSecondary }]}>No issues yet</Text>
              <Pressable
                onPress={() => setShowCreateIssue(true)}
                style={[s.emptyBtn, { borderColor: colors.border }]}
              >
                <Feather name="plus" size={14} color={colors.inkSubtle} style={{ marginRight: 6 }} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.inkSubtle }}>New issue</Text>
              </Pressable>
            </View>
          )
        )}
      </View>

      {/* Create Issue Modal */}
      <CreateIssueModal
        visible={showCreateIssue}
        projectId={project.id}
        onClose={() => setShowCreateIssue(false)}
        colors={colors}
      />
      
      {/* Link Page Modal */}
      <LinkPageModal
        visible={showLinkPage}
        projectId={project.id}
        onClose={() => setShowLinkPage(false)}
        colors={colors}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  titleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 8 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  headerTitle: { ...typography.headline, fontSize: 17 },
  tabRow: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { ...typography.body, fontFamily: fonts.medium },
  content: { flex: 1 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { ...typography.body, fontFamily: fonts.medium, marginBottom: spacing.md },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  cardTitle: { ...typography.body, fontFamily: fonts.semiBold },
  cardSub: {
    ...typography.caption,
    marginTop: 2,
  },
  bentoCard: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.lg,
    padding: spacing.md,
    height: 140,
    justifyContent: 'space-between',
  },
  bentoIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  bentoTitle: {
    ...typography.bodySm,
    fontFamily: fonts.semiBold,
    lineHeight: 18,
    marginBottom: 4,
  },
  bentoSub: {
    ...typography.caption,
    fontSize: 11,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  statusTitle: {
    ...typography.bodySm,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  statusCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

const ms = StyleSheet.create({
  // Issue row
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  statusBtn: { padding: 2 },
  issueTitle: { fontFamily: fonts.semiBold, fontSize: 15 },
  issueDesc: { fontFamily: fonts.regular, fontSize: 13, marginTop: 2 },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: radii.xs,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalClose: { paddingVertical: 4, paddingHorizontal: 2 },
  modalTitle: { fontFamily: fonts.semiBold, fontSize: 16 },
  modalSave: { paddingVertical: 6, paddingHorizontal: spacing.md, borderRadius: radii.sm },
  modalBody: { padding: spacing.lg, gap: spacing.md },
  titleInput: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.md,
  },
  descInput: {
    fontFamily: fonts.regular,
    fontSize: 15,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.md,
    minHeight: 80,
  },
  fieldLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
});

// ─── WatermelonDB HOC ─────────────────────────────────────────────────────────

const ProjectContainer = withObservables(['id'], ({ id }: { id: string }) => ({
  project: db.collections.get<Project>('projects').findAndObserve(id),
}))(
  withObservables(['project'], ({ project }: { project: Project }) => ({
    pages: project.pages.observe(),
    issues: project.issues.observe(),
  }))(ProjectScreen)
);

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <ProjectContainer id={id} />;
}
