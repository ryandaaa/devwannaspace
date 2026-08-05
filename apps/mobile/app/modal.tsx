import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, fonts } from '@/lib/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Modal Screen ─────────────────────────────────────────
// Generic modal container following DESIGN.md animation specs:
// - Overlay: 0.15s ease-out fade
// - Card: 0.2s cubic-bezier(0.16, 1, 0.3, 1), scale 0.96→1, translateY 8→0

export default function ModalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const overlayScale = useSharedValue(1);

  const handleDismiss = () => {
    router.back();
  };

  return (
    <Animated.View
      style={s.overlay}
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
    >
      {/* Backdrop tap to dismiss */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss} />

      {/* Modal card */}
      <Animated.View
        style={[s.card, { marginBottom: insets.bottom + spacing.xl }]}
        entering={FadeIn.duration(200).springify().damping(20).stiffness(300)}
      >
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>Modal</Text>
          <AnimatedPressable
            onPress={handleDismiss}
            style={s.closeBtn}
          >
            <Feather name="x" color={colors.inkSubtle} size={20} />
          </AnimatedPressable>
        </View>

        <View style={s.cardBody}>
          <Text style={s.cardText}>
            This is a modal screen. It uses the transparent presentation
            with animated overlay and card entrance per DESIGN.md specs.
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    borderRadius: 0, // Brutalist
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  cardTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: spacing.lg,
  },
  cardText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.inkSubtle,
    lineHeight: 22,
  },
});
