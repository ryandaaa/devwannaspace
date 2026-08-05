import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import withObservables from '@nozbe/with-observables';

import { db } from '@/lib/db';
import Issue from '@/lib/db/models/Issue';
import { useTheme, typography, spacing, radii, fonts } from '@/lib/theme';

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

const PRIORITY_COLORS: Record<Priority, string> = {
  'No Priority': '#62666d',
  'Low': '#8a8f98',
  'Medium': '#d97706',
  'High': '#ef4444',
  'Urgent': '#dc2626',
};

interface IssueProps {
  issue: Issue;
}

function IssueScreen({ issue }: IssueProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme: { colors } } = useTheme();

  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description || '');

  // Auto-save title/desc on blur or change
  const saveChanges = async () => {
    try {
      await db.write(async () => {
        await issue.update((i) => {
          i.title = title.trim() || 'Untitled';
          i.description = description.trim();
        });
      });
    } catch (err) {
      console.error('Failed to update issue', err);
    }
  };

  const cycleStatus = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentIndex = STATUSES.indexOf(issue.status as Status);
    const nextStatus = STATUSES[(currentIndex + 1) % STATUSES.length];
    try {
      await db.write(async () => {
        await issue.update(i => {
          i.status = nextStatus;
        });
      });
    } catch (err) {}
  };

  const cyclePriority = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentIndex = PRIORITIES.indexOf(issue.priority as Priority);
    const nextPriority = PRIORITIES[(currentIndex + 1) % PRIORITIES.length];
    try {
      await db.write(async () => {
        await issue.update(i => {
          i.priority = nextPriority;
        });
      });
    } catch (err) {}
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Delete Issue', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await db.write(async () => {
              await issue.destroyPermanently();
            });
            router.back();
          } catch (err) {
            console.error(err);
          }
        }
      }
    ]);
  };

  return (
    <KeyboardAvoidingView style={[s.container, { backgroundColor: colors.canvas, paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => { saveChanges(); router.back(); }} style={s.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.inkSubtle} />
        </Pressable>
        <Text style={[s.headerTitle, { color: colors.inkSubtle }]}>Issue Details</Text>
        <Pressable onPress={handleDelete} style={s.iconButton}>
          <Feather name="trash-2" size={20} color={colors.danger || colors.inkTertiary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" onScrollBeginDrag={saveChanges}>
        {/* Title */}
        <TextInput
          style={[s.titleInput, { color: colors.ink }]}
          value={title}
          onChangeText={setTitle}
          onBlur={saveChanges}
          placeholder="Issue Title"
          placeholderTextColor={colors.inkTertiary}
          multiline
          scrollEnabled={false}
        />

        {/* Properties */}
        <View style={s.propsRow}>
          <Pressable 
            style={[s.propBadge, { backgroundColor: colors.surface, borderColor: STATUS_COLORS[issue.status as Status] || colors.border }]}
            onPress={cycleStatus}
          >
            <Feather name="circle" size={14} color={STATUS_COLORS[issue.status as Status] || colors.inkSecondary} />
            <Text style={[s.propText, { color: colors.ink }]}>{issue.status}</Text>
          </Pressable>

          <Pressable 
            style={[s.propBadge, { backgroundColor: colors.surface, borderColor: PRIORITY_COLORS[issue.priority as Priority] || colors.border }]}
            onPress={cyclePriority}
          >
            <Feather name="flag" size={14} color={PRIORITY_COLORS[issue.priority as Priority] || colors.inkSecondary} />
            <Text style={[s.propText, { color: colors.ink }]}>{issue.priority}</Text>
          </Pressable>
        </View>

        {/* Description */}
        <View style={s.descContainer}>
          <Text style={[s.sectionTitle, { color: colors.inkSecondary }]}>Description</Text>
          <TextInput
            style={[s.descInput, { color: colors.ink, backgroundColor: colors.surface, borderColor: colors.border }]}
            value={description}
            onChangeText={setDescription}
            onBlur={saveChanges}
            placeholder="Add a detailed description..."
            placeholderTextColor={colors.inkTertiary}
            multiline
            textAlignVertical="top"
          />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.bodySm,
    fontFamily: fonts.medium,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  titleInput: {
    ...typography.displayMd,
    minHeight: 40,
    marginBottom: spacing.xl,
  },
  propsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
    flexWrap: 'wrap',
  },
  propBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    gap: spacing.sm,
  },
  propText: {
    ...typography.bodySm,
    fontFamily: fonts.medium,
  },
  sectionTitle: {
    ...typography.bodySm,
    fontFamily: fonts.semiBold,
    marginBottom: spacing.sm,
  },
  descContainer: {
    marginTop: spacing.sm,
  },
  descInput: {
    ...typography.body,
    minHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    padding: spacing.md,
    lineHeight: 24,
  },
});

const enhance = withObservables(['id'], ({ id }: { id: string }) => ({
  issue: db.get<Issue>('issues').findAndObserve(id),
}));
const EnhancedIssueScreen = enhance(IssueScreen);

export default function IssueRoute() {
  const { id } = useLocalSearchParams();
  return <EnhancedIssueScreen id={id as string} />;
}
