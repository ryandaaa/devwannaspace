import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, BackHandler } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { spacing, fonts } from '@/lib/theme';

export interface MenuOption {
  id: string;
  label: string;
  subtitle?: string;
  icon: keyof typeof Feather.glyphMap;
  selected?: boolean;
  danger?: boolean;
  onPress: () => void;
}

export default function ActionSheetOverlay({
  onClose,
  title,
  subtitle,
  options,
  colors: c,
}: {
  onClose: () => void;
  title?: string;
  subtitle?: string;
  options: MenuOption[];
  colors: any;
}) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const onBackPress = () => {
      onClose();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [onClose]);

  return (
    <Animated.View
      entering={FadeIn.duration(120)}
      exiting={FadeOut.duration(120)}
      style={[StyleSheet.absoluteFill, { zIndex: 999, elevation: 999 }]}
    >
      <View style={asm.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          entering={SlideInDown.duration(140)}
          exiting={SlideOutDown.duration(140)}
          style={[
            asm.sheet,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
              paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xs,
            },
          ]}
        >
          {/* Drag Handle */}
          <View style={asm.handleContainer}>
            <View style={[asm.handle, { backgroundColor: c.borderStrong || c.border }]} />
          </View>

          {/* Header */}
          {(title || subtitle) && (
            <View style={[asm.header, { borderBottomColor: c.borderSubtle }]}>
              {title && <Text style={[asm.title, { color: c.ink }]}>{title}</Text>}
              {subtitle && <Text style={[asm.subtitle, { color: c.inkSubtle }]}>{subtitle}</Text>}
            </View>
          )}

          {/* Options */}
          <View style={asm.optionsList}>
            {options.map((opt) => (
              <Pressable
                key={opt.id}
                style={({ pressed }) => [
                  asm.optionRow,
                  { backgroundColor: pressed ? c.surfaceHover || 'rgba(255,255,255,0.05)' : 'transparent' },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                  setTimeout(() => opt.onPress(), 100);
                }}
              >
                <View style={[asm.iconBox, { backgroundColor: opt.danger ? c.dangerBg || '#fef2f2' : c.canvas }]}>
                  <Feather
                    name={opt.icon}
                    size={18}
                    color={opt.danger ? c.danger || '#ef4444' : (opt.selected ? c.accent : c.inkSecondary)}
                  />
                </View>
                <View style={asm.labelContainer}>
                  <Text style={[
                    asm.label,
                    { color: opt.danger ? c.danger || '#ef4444' : c.ink },
                    opt.selected && { fontFamily: fonts.semiBold },
                  ]}>
                    {opt.label}
                  </Text>
                  {opt.subtitle && (
                    <Text style={[asm.optionSubtitle, { color: c.inkTertiary }]}>{opt.subtitle}</Text>
                  )}
                </View>
                {opt.selected && (
                  <Feather name="check" size={18} color={c.accent} />
                )}
              </Pressable>
            ))}
          </View>

          {/* Cancel button */}
          <Pressable
            style={({ pressed }) => [
              asm.cancelBtn,
              { backgroundColor: pressed ? c.surfaceActive || 'rgba(0,0,0,0.1)' : c.canvas, borderColor: c.border },
            ]}
            onPress={onClose}
          >
            <Text style={[asm.cancelText, { color: c.inkSubtle }]}>Cancel</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const asm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 0,
    opacity: 0.6,
  },
  header: {
    paddingBottom: spacing.md,
    marginBottom: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    marginTop: 2,
  },
  optionsList: {
    paddingVertical: spacing.xs,
    gap: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    borderRadius: 0,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  optionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 1,
  },
  cancelBtn: {
    marginTop: spacing.sm,
    paddingVertical: 12,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  cancelText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
});
