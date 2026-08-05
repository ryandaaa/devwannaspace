import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import withObservables from '@nozbe/with-observables';
import { Q } from '@nozbe/watermelondb';

import { colors, spacing, radii, typography, fonts, shadows, timing } from '@/lib/theme';
import { db } from '@/lib/db';
import Page from '@/lib/db/models/Page';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Section ──
// Helpers

const formatDate = (date: Date) => {
  if (!date || isNaN(date.getTime())) return 'Unknown date';
  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  if (diffHours < 24) return 'Edited recently';
  if (diffHours < 48) return 'Edited yesterday';
  return `Edited ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
};

// ── Section ──
// Components

const FavoriteRow = ({ page, index }: { page: Page; index: number }) => {
  const router = useRouter();
  const scale = useSharedValue(1);

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
    router.push(`/editor/${page.id}` as any);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[s.rowContainer, animatedStyle]}
      >
        <View style={s.iconContainer}>
          <Feather name="star" size={16} color={colors.warning} />
        </View>
        
        <View style={s.rowContent}>
          <Text style={s.rowTitle} numberOfLines={1}>{page.title || 'Untitled'}</Text>
          <Text style={s.rowSubtitle} numberOfLines={1}>{formatDate(new Date(page.updatedAt))}</Text>
        </View>

        <Feather name="chevron-right" size={16} color={colors.inkTertiary} />
      </AnimatedPressable>
      <View style={s.divider} />
    </Animated.View>
  );
};

const EmptyState = () => (
  <View style={s.emptyContainer}>
    <Feather name="star" size={48} color={colors.inkTertiary} style={s.emptyIcon} />
    <Text style={s.emptyTitle}>No starred pages</Text>
    <Text style={s.emptyDescription}>
      Tap ⭐ on a page to save{'\n'}it here for quick access
    </Text>
  </View>
);

const FavoritesScreen = ({ pages }: { pages: Page[] }) => {
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item, index }: { item: Page; index: number }) => {
    return <FavoriteRow page={item} index={index} />;
  }, []);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <Text style={s.headerTitle}>Starred</Text>
      <View style={s.listContainer}>
        {React.createElement(FlashList as any, {
          data: pages,
          renderItem: renderItem,
          estimatedItemSize: 60,
          ListEmptyComponent: <EmptyState />,
          contentContainerStyle: { paddingBottom: insets.bottom + spacing.xxl }
        })}
      </View>
    </View>
  );
};

// ── Section ──
// Styles

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  headerTitle: {
    ...typography.displayLg,
    color: colors.ink,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  listContainer: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.canvas,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: radii.xs,
    backgroundColor: `${colors.warning}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rowTitle: {
    ...typography.body,
    fontFamily: fonts.medium,
    color: colors.ink,
    marginBottom: 2,
  },
  rowSubtitle: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 28 + spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.headline,
    color: colors.inkSubtle,
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    ...typography.bodySm,
    color: colors.inkTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

const enhance = withObservables([], () => ({
  pages: db.collections.get<Page>('pages').query(
    Q.where('is_favorite', true),
    Q.sortBy('updated_at', Q.desc)
  ).observe()
}));

export default enhance(FavoritesScreen);
