import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, spacing, radii, typography, fonts } from '@/lib/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Section ──
// Animations & Haptics Helpers

const usePressAnimation = () => {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return { onPressIn, onPressOut, animatedStyle };
};

// ── Section ──
// Settings Row Component

interface SettingsRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  isLast?: boolean;
  onPress: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, value, isLast, onPress }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { onPressIn, onPressOut, animatedStyle } = usePressAnimation();

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={[{ backgroundColor: colors.surface }, animatedStyle]}
    >
      <View style={s.rowContent}>
        <View style={s.rowLeft}>
          <Feather name={icon} size={18} color={colors.inkSecondary} style={s.rowIcon} />
          <Text style={[s.rowLabel, { color: colors.ink }]}>{label}</Text>
        </View>
        <View style={s.rowRight}>
          {value && <Text style={[s.rowValue, { color: colors.inkTertiary }]}>{value}</Text>}
          <Feather name="chevron-right" size={20} color={colors.inkSubtle} />
        </View>
      </View>
      {!isLast && <View style={[s.divider, { backgroundColor: colors.border }]} />}
    </AnimatedPressable>
  );
};

// ── Section ──
// Settings Screen

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { mode, theme } = useTheme();
  const { colors } = theme;

  const { onPressIn: onProfilePressIn, onPressOut: onProfilePressOut, animatedStyle: profileStyle } = usePressAnimation();
  const { onPressIn: onSignOutPressIn, onPressOut: onSignOutPressOut, animatedStyle: signOutStyle } = usePressAnimation();

  const getModeDisplay = (currentMode: string) => {
    switch (currentMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
      default:
        return 'System';
    }
  };

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.firstName
    ? user.firstName[0]
    : 'U';

  const email = user?.primaryEmailAddress?.emailAddress || 'No email attached';
  const name = user?.fullName || 'User';
  const imageUrl = user?.imageUrl;

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signOut();
  };

  return (
    <ScrollView 
      style={[s.container, { backgroundColor: colors.canvas }]}
      contentContainerStyle={[
        s.contentContainer,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xxl }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[s.headerTitle, { color: colors.ink }]}>Settings</Text>

      {/* Profile Card */}
      <AnimatedPressable
        onPressIn={onProfilePressIn}
        onPressOut={onProfilePressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/profile');
        }}
        style={[
          s.profileCard, 
          { backgroundColor: colors.surface, borderColor: colors.border },
          profileStyle
        ]}
      >
        <View style={s.profileLeft}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={s.avatarImage} />
          ) : (
            <View style={[s.avatar, { backgroundColor: colors.accent }]}>
              <Text style={[s.avatarText, { color: colors.onAccent }]}>{initials}</Text>
            </View>
          )}
          <View style={s.profileInfo}>
            <Text style={[s.profileName, { color: colors.ink }]}>{name}</Text>
            <Text style={[s.profileEmail, { color: colors.inkSubtle }]}>{email}</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={colors.inkSubtle} />
      </AnimatedPressable>

      {/* Preferences Section */}
      <View style={s.section}>
        <Text style={[s.sectionHeader, { color: colors.inkSubtle }]}>Preferences</Text>
        <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow 
            icon="sun" 
            label="Appearance" 
            value={getModeDisplay(mode)}
            onPress={() => router.push('/appearance')}
          />
          <SettingsRow 
            icon="bell" 
            label="Notifications" 
            onPress={() => {}}
          />
          <SettingsRow 
            icon="cloud" 
            label="Data & Sync" 
            value="Auto"
            isLast
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={s.section}>
        <Text style={[s.sectionHeader, { color: colors.inkSubtle }]}>Support</Text>
        <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow 
            icon="help-circle" 
            label="Help & Feedback" 
            onPress={() => {}}
          />
          <SettingsRow 
            icon="file-text" 
            label="Privacy Policy" 
            isLast
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Sign Out Button */}
      <AnimatedPressable
        onPressIn={onSignOutPressIn}
        onPressOut={onSignOutPressOut}
        onPress={handleSignOut}
        style={[
          s.signOutCard, 
          { backgroundColor: colors.dangerBg, borderColor: colors.danger },
          signOutStyle
        ]}
      >
        <Feather name="log-out" size={18} color={colors.danger} />
        <Text style={[s.signOutText, { color: colors.danger }]}>Sign Out</Text>
      </AnimatedPressable>

      {/* Version */}
      <Text style={[s.versionText, { color: colors.inkTertiary }]}>devwannaspace · v1.0.0</Text>
    </ScrollView>
  );
}

// ── Section ──
// Styles

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
  },
  headerTitle: {
    ...typography.displayLg,
    marginBottom: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xxl,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.sm,
  },
  avatarText: {
    ...typography.headline,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  profileName: {
    ...typography.headline,
    marginBottom: 2,
  },
  profileEmail: {
    ...typography.caption,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    ...typography.eyebrow,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
    textTransform: 'none',
    fontFamily: fonts.medium,
  },
  card: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: spacing.sm,
  },
  rowLabel: {
    ...typography.body,
    fontFamily: fonts.medium,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    ...typography.bodySm,
    marginRight: spacing.xs,
  },
  divider: {
    height: 1,
    marginLeft: 40,
    borderStyle: 'dashed',
  },
  signOutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    paddingVertical: 14,
    marginTop: spacing.sm,
  },
  signOutText: {
    ...typography.button,
    marginLeft: spacing.xs,
  },
  versionText: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
