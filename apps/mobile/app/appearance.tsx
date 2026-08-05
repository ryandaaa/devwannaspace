import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme, ThemeMode, spacing, radii, typography, fonts } from '@/lib/theme';

interface ThemeOption {
  id: ThemeMode;
  label: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'light',
    label: 'Light',
    subtitle: 'Light mode palette',
    icon: 'sun',
  },
  {
    id: 'dark',
    label: 'Dark',
    subtitle: 'Dark mode palette',
    icon: 'moon',
  },
  {
    id: 'system',
    label: 'System Default',
    subtitle: 'Follows device OS appearance setting',
    icon: 'smartphone',
  },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode, setThemeMode, theme } = useTheme();
  const { colors } = theme;

  const handleSelect = (newMode: ThemeMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemeMode(newMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }} 
          style={styles.backBtn}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={22} color={colors.ink} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Appearance</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.inkSubtle }]}>THEME PREFERENCE</Text>
        
        <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {themeOptions.map((option, index) => {
            const isSelected = mode === option.id;
            const isLast = index === themeOptions.length - 1;

            return (
              <React.Fragment key={option.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.optionCard,
                    pressed && { backgroundColor: colors.surfaceHover },
                    isSelected && { backgroundColor: colors.accentBg },
                  ]}
                  onPress={() => handleSelect(option.id)}
                >
                  <View style={styles.optionLeft}>
                    <View 
                      style={[
                        styles.iconContainer, 
                        { 
                          backgroundColor: isSelected ? colors.accent : colors.surfaceActive,
                        }
                      ]}
                    >
                      <Feather 
                        name={option.icon} 
                        size={18} 
                        color={isSelected ? colors.onAccent : colors.inkSecondary} 
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={[styles.optionLabel, { color: colors.ink }]}>{option.label}</Text>
                      <Text style={[styles.optionSubtitle, { color: colors.inkSecondary }]}>{option.subtitle}</Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={[styles.checkmarkContainer, { backgroundColor: colors.accent }]}>
                      <Feather name="check" size={14} color={colors.onAccent} />
                    </View>
                  )}
                </Pressable>
                {!isLast && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              </React.Fragment>
            );
          })}
        </View>

        <Text style={[styles.description, { color: colors.inkTertiary }]}>
          Choose how you want devwannaspace to look. System default will automatically adapt to your device's light or dark mode settings.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  sectionTitle: {
    ...typography.eyebrow,
    marginLeft: spacing.xs,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  cardGroup: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    ...typography.body,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  optionSubtitle: {
    ...typography.caption,
    fontSize: 12,
    marginTop: 2,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 68,
  },
  description: {
    ...typography.caption,
    marginTop: spacing.md,
    marginLeft: spacing.xs,
    marginRight: spacing.xs,
    lineHeight: 18,
  },
});
