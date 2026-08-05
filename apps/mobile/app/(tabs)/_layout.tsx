import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors as staticColors, fonts, useTheme } from '@/lib/theme';
import { db } from '@/lib/db';
import Page from '@/lib/db/models/Page';

// ── Tab Icon ─────────────────────────────────────────────
function TabIcon({ name, focused, activeColors }: { name: keyof typeof Feather.glyphMap; focused: boolean; activeColors: any }) {
  return (
    <View style={s.iconWrap}>
      <Feather name={name} size={22} color={focused ? activeColors.accent : activeColors.inkTertiary} />
    </View>
  );
}

// ── Tab Button with spring press ─────────────────────────
function TabButton({ onPress, onLongPress, children, ...props }: any) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) onPress(e);
      }}
      onLongPress={onLongPress}
      onPressIn={() => { scale.value = withSpring(0.9, { damping: 15, stiffness: 250 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 180 }); }}
      style={s.tabBtn}
      {...props}
    >
      <Animated.View style={[s.tabBtnInner, animStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

// ── Add Button (Center FAB) ──────────────────────────────
function AddButton({ onPress, activeColors }: { onPress: () => void; activeColors: any }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={s.addBtnContainer}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.85, { damping: 12, stiffness: 200 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 10, stiffness: 150 }); }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
      >
        <Animated.View style={[s.addBtnInner, animStyle, { backgroundColor: activeColors.accent, shadowColor: activeColors.accent }]}>
          <Feather name="plus" size={26} color={activeColors.onAccent} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

// ── Tab Layout ───────────────────────────────────────────
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  const activeColors = theme.colors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: activeColors.accent,
        tabBarInactiveTintColor: activeColors.inkTertiary,
        tabBarButton: (props) => <TabButton {...props} />,
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 10,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: activeColors.canvas,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: activeColors.border,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 60 + Math.max(insets.bottom, 0),
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} activeColors={activeColors} />,
      }} />
      <Tabs.Screen name="projects" options={{
        title: 'Projects',
        tabBarIcon: ({ focused }) => <TabIcon name="layers" focused={focused} activeColors={activeColors} />,
      }} />
      
      {/* ── FAB Tab ── */}
      <Tabs.Screen name="create" options={{
        title: '',
        tabBarIcon: () => null,
        tabBarButton: (props) => (
          <AddButton 
            activeColors={activeColors}
            onPress={async () => {
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
                if (newId) {
                  router.push(`/editor/${newId}`);
                }
              } catch (error) {
                console.error('Failed to create page', error);
              }
            }} 
          />
        )
      }} />

      <Tabs.Screen name="search" options={{
        title: 'Search',
        tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} activeColors={activeColors} />,
      }} />
      <Tabs.Screen name="settings" options={{
        title: 'Settings',
        tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} activeColors={activeColors} />,
      }} />

      {/* Hide favorites from tab bar but keep it accessible */}
      <Tabs.Screen name="favorites" options={{
        href: null,
      }} />
    </Tabs>
  );
}

const s = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  activeDot: {
    position: 'absolute',
    top: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: staticColors.accent,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: staticColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24, // Elevate above tab bar
    shadowColor: staticColors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  }
});
