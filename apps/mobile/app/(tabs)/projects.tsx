import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInDown } from 'react-native-reanimated';
import withObservables from '@nozbe/with-observables';

import { colors as staticColors, spacing, radii, typography, fonts, shadows, timing, useTheme } from '@/lib/theme';
import Project from '@/lib/db/models/Project';
import Page from '@/lib/db/models/Page';
import Issue from '@/lib/db/models/Issue';
import { db } from '@/lib/db';



// ── Section: Components ──

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const enhanceProjectCard = withObservables(['project'], ({ project }: { project: Project }) => ({
  project: project.observe(),
  pages: project.pages.observe(),
  issues: project.issues.observe(),
}));

const BaseProjectCard = ({ project, index, pages = [], issues = [] }: { project: Project; index: number; pages?: Page[]; issues?: Issue[] }) => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const { theme: { colors } } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/project/${project.id}`);
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await db.write(async () => {
                await project.destroyPermanently();
              });
            } catch (error) {
              console.error('Failed to delete project', error);
            }
          }
        }
      ]
    );
  };

  const displayDescription = project.description || `${pages.length} pages · ${issues.length} issues`;
  const recentPages = [...pages].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 3);

  return (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={300}
        style={[s.card, animatedStyle, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={s.cardTopRow}>
          <View style={[s.colorDot, { backgroundColor: project.color || colors.accent }]} />
          <Text style={[s.cardTitle, { color: colors.ink }]}>{project.name}</Text>
        </View>
        
        <View style={s.cardSecondRow}>
          <Text style={[s.cardDescription, { color: colors.inkSecondary }]}>
            {displayDescription}
          </Text>
        </View>

        {pages.length > 0 && (
          <View style={s.cardBottomRow}>
            {recentPages.map((page, i) => (
              <View key={page.id || i} style={[s.pagePill, { backgroundColor: colors.surfaceHover, borderColor: colors.border }]}>
                <Feather name="file-text" size={12} color={colors.inkTertiary} />
                <Text style={[s.pagePillText, { color: colors.inkSecondary }]} numberOfLines={1}>
                  {page.title || 'Untitled'}
                </Text>
              </View>
            ))}
            {pages.length > 3 && (
              <View style={[s.pagePill, { backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0 }]}>
                <Text style={{ fontSize: 12, color: colors.inkTertiary, fontFamily: fonts.medium }}>
                  +{pages.length - 3} more
                </Text>
              </View>
            )}
          </View>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
};

const ProjectCard = enhanceProjectCard(BaseProjectCard);

const ProjectsScreen = ({ projects }: { projects: Project[] }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme: { colors } } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'a-z'>('newest');

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (searchQuery.trim()) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result.sort((a, b) => {
      if (sortOrder === 'a-z') return a.name.localeCompare(b.name);
      return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
    });
  }, [projects, searchQuery, sortOrder]);

  const handleAddPress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Create new project with random theme color
    const palette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
    const randomColor = palette[Math.floor(Math.random() * palette.length)];

    try {
      await db.write(async () => {
        await db.get<Project>('projects').create((p) => {
          p.name = 'New Project';
          p.color = randomColor;
          p.description = 'A brand new workspace';
        });
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to create project', error);
      Alert.alert('Error', 'Could not create project');
    }
  }, []);

  return (
    <View style={[s.container, { paddingTop: insets.top, backgroundColor: colors.canvas }]}>
      <View style={s.header}>
        <Text style={[s.headerTitle, { color: colors.ink }]}>Projects</Text>
        <Pressable 
          style={[s.addButton, { backgroundColor: colors.accent }]}
          onPress={handleAddPress}
          hitSlop={8}
        >
          <Feather name="plus" size={20} color={colors.onAccent} />
        </Pressable>
      </View>

      <View style={s.toolbar}>
        <View style={[s.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.inkTertiary} />
          <TextInput 
            style={[s.searchInput, { color: colors.ink }]} 
            placeholder="Search projects..."
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

      {filteredProjects.length === 0 ? (
        <View style={s.emptyState}>
          <Feather name="layers" size={48} color={colors.inkTertiary} style={s.emptyIcon} />
          <Text style={[s.emptyTitle, { color: colors.inkSecondary }]}>
            {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
          </Text>
          {projects.length === 0 && (
            <Pressable style={[s.emptyButton, { backgroundColor: colors.accent }]} onPress={handleAddPress}>
              <Text style={[s.emptyButtonText, { color: colors.onAccent }]}>Create your first project</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// ── Section: Styles ──
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    ...typography.displayLg,
    color: staticColors.ink,
  },
  addButton: {
    backgroundColor: staticColors.accent,
    width: 36,
    height: 36,
    borderRadius: 9999, // radii.pill
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
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
    borderRadius: radii.md,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: staticColors.surface,
    borderColor: staticColors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  cardTitle: {
    ...typography.headline,
    color: staticColors.ink,
  },
  cardSecondRow: {
    marginBottom: spacing.md,
  },
  cardDescription: {
    ...typography.bodySm,
    color: staticColors.inkSecondary,
  },
  cardBottomRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  pagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 130,
  },
  pagePillText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.headline,
    color: staticColors.inkSecondary,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    backgroundColor: staticColors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  emptyButtonText: {
    ...typography.button,
    color: staticColors.onAccent,
  },
});

const enhance = withObservables([], () => ({
  projects: db.collections.get<Project>('projects').query().observe(),
}));

export default enhance(ProjectsScreen);
