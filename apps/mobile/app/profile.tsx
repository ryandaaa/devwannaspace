import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme, spacing, radii, typography, fonts } from '@/lib/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { theme } = useTheme();
  const { colors } = theme;

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [imageError, setImageError] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.firstName !== undefined) setFirstName(user.firstName || '');
      if (user.lastName !== undefined) setLastName(user.lastName || '');
    }
  }, [user]);

  const initials =
    firstName || lastName
      ? `${(firstName[0] || '').toUpperCase()}${(lastName[0] || '').toUpperCase()}`
      : 'U';

  const email = user?.primaryEmailAddress?.emailAddress || '';
  const imageUrl = user?.imageUrl;

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFeedback('Profile updated successfully! (Placeholder UI)');

    Alert.alert(
      'Profile Saved',
      'Your profile information has been saved locally (Placeholder mode).',
      [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { backgroundColor: colors.canvas }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Navigation Header */}
      <View
        style={[
          s.header,
          {
            paddingTop: insets.top,
            borderBottomColor: colors.border,
            backgroundColor: colors.canvas,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={s.backBtn}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={22} color={colors.ink} />
        </Pressable>
        <Text style={[s.headerTitle, { color: colors.ink }]}>Edit Profile</Text>
        <View style={s.headerRightPlaceholder} />
      </View>

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={[
          s.contentContainer,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Feedback Banner */}
        {feedback && (
          <View
            style={[
              s.feedbackBanner,
              { backgroundColor: colors.successBg, borderColor: colors.success },
            ]}
          >
            <Feather name="check-circle" size={18} color={colors.success} />
            <Text style={[s.feedbackText, { color: colors.success }]}>
              {feedback}
            </Text>
          </View>
        )}

        {/* Avatar Section */}
        <View style={s.avatarContainer}>
          <View style={s.avatarWrapper}>
            {imageUrl && !imageError ? (
              <Image
                source={{ uri: imageUrl }}
                style={s.avatarImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={[s.avatarFallback, { backgroundColor: colors.accent }]}>
                <Text style={[s.avatarText, { color: colors.onAccent }]}>
                  {initials}
                </Text>
              </View>
            )}
            <View
              style={[
                s.avatarBadge,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Feather name="camera" size={14} color={colors.inkSecondary} />
            </View>
          </View>
          <Text style={[s.avatarSubtitle, { color: colors.inkSubtle }]}>
            {user?.fullName || `${firstName} ${lastName}`.trim() || 'User Profile'}
          </Text>
        </View>

        {/* Form Group */}
        <View style={s.formSection}>
          <Text style={[s.sectionTitle, { color: colors.inkSubtle }]}>
            PERSONAL INFORMATION
          </Text>

          <View style={s.formGroup}>
            <Text style={[s.label, { color: colors.inkSecondary }]}>
              First Name
            </Text>
            <TextInput
              style={[
                s.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.ink,
                },
              ]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor={colors.inkPlaceholder}
              autoCapitalize="words"
            />
          </View>

          <View style={s.formGroup}>
            <Text style={[s.label, { color: colors.inkSecondary }]}>
              Last Name
            </Text>
            <TextInput
              style={[
                s.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.ink,
                },
              ]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor={colors.inkPlaceholder}
              autoCapitalize="words"
            />
          </View>

          <View style={s.formGroup}>
            <Text style={[s.label, { color: colors.inkSecondary }]}>
              Email Address
            </Text>
            <View
              style={[
                s.disabledInputContainer,
                {
                  backgroundColor: colors.surfaceActive,
                  borderColor: colors.border,
                },
              ]}
            >
              <TextInput
                style={[s.inputDisabled, { color: colors.inkSubtle }]}
                value={email || 'No email attached'}
                editable={false}
                placeholderTextColor={colors.inkPlaceholder}
              />
              <Feather name="lock" size={16} color={colors.inkTertiary} />
            </View>
            <Text style={[s.helperText, { color: colors.inkTertiary }]}>
              Primary email address is managed by your authentication provider.
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <AnimatedPressable
          style={[
            s.saveBtn,
            { backgroundColor: colors.accent },
            animStyle,
          ]}
          onPressIn={() => {
            scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 15, stiffness: 150 });
          }}
          onPress={handleSave}
        >
          <Feather name="check" size={18} color={colors.onAccent} style={s.saveIcon} />
          <Text style={[s.saveBtnText, { color: colors.onAccent }]}>
            Save Changes
          </Text>
        </AnimatedPressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
  },
  headerTitle: {
    ...typography.headline,
    fontSize: 17,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  feedbackText: {
    ...typography.bodySm,
    fontFamily: fonts.medium,
    marginLeft: spacing.xs,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.displayLg,
    fontSize: 32,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSubtitle: {
    ...typography.caption,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.eyebrow,
    marginLeft: spacing.xs,
    marginBottom: spacing.sm,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodySm,
    fontFamily: fonts.medium,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  input: {
    ...typography.body,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  disabledInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  inputDisabled: {
    ...typography.body,
    flex: 1,
  },
  helperText: {
    ...typography.caption,
    marginTop: spacing.xxs,
    marginLeft: spacing.xs,
  },
  saveBtn: {
    flexDirection: 'row',
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  saveIcon: {
    marginRight: spacing.xs,
  },
  saveBtnText: {
    ...typography.button,
    fontSize: 15,
  },
});
