import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Backgrounds
  canvas: string;
  surface: string;
  surfaceHover: string;
  surfaceActive: string;

  // Borders
  border: string;
  borderSubtle: string;
  borderStrong: string;

  // Text
  ink: string;
  inkSecondary: string;
  inkTertiary: string;
  inkPlaceholder: string;
  inkSubtle: string;

  // Accent & Brand
  accent: string;
  accentHover: string;
  accentBg: string;
  accentBgStrong: string;
  onAccent: string;
  primary: string;

  // Semantic
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;
  onDanger: string;

  // Overlay
  overlay: string;
}

export const lightColors: ThemeColors = {
  canvas: '#ffffff',
  surface: '#fafafa',
  surfaceHover: '#f5f5f5',
  surfaceActive: '#eeeeee',
  border: 'rgba(0, 0, 0, 0.08)',
  borderSubtle: 'rgba(0, 0, 0, 0.04)',
  borderStrong: 'rgba(0, 0, 0, 0.16)',
  ink: '#1a1a1a',
  inkSecondary: '#6b6b6b',
  inkTertiary: '#9b9b9b',
  inkPlaceholder: '#b4b4b4',
  inkSubtle: '#8b8b8b',
  accent: '#2383e2',
  accentHover: '#1a73c7',
  accentBg: '#e8f0fe',
  accentBgStrong: '#d0e1fc',
  onAccent: '#ffffff',
  primary: '#2383e2',
  success: '#0f7b3f',
  successBg: '#e6f4ea',
  warning: '#d97706',
  warningBg: '#fef3c7',
  danger: '#eb5757',
  dangerBg: '#fde8e8',
  onDanger: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const darkColors: ThemeColors = {
  canvas: '#121212',
  surface: '#1e1e1e',
  surfaceHover: '#2a2a2a',
  surfaceActive: '#333333',
  border: 'rgba(255, 255, 255, 0.12)',
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  borderStrong: 'rgba(255, 255, 255, 0.22)',
  ink: '#f3f4f6',
  inkSecondary: '#9ca3af',
  inkTertiary: '#6b7280',
  inkPlaceholder: '#4b5563',
  inkSubtle: '#9ca3af',
  accent: '#3b82f6',
  accentHover: '#60a5fa',
  accentBg: 'rgba(59, 130, 246, 0.18)',
  accentBgStrong: 'rgba(59, 130, 246, 0.32)',
  onAccent: '#ffffff',
  primary: '#3b82f6',
  success: '#10b981',
  successBg: 'rgba(16, 185, 129, 0.18)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.18)',
  danger: '#ef4444',
  dangerBg: 'rgba(239, 68, 68, 0.18)',
  onDanger: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

// Default fallback static colors (defaults to dark theme per consistency with web/DESIGN.md)
export const colors = darkColors;

// Spacing
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// Border Radii
export const radii = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  pill: 9999,
} as const;

// Fonts
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
} as const;

// Typography
export const typography = {
  displayLg: {
    fontFamily: fonts.semiBold,
    fontSize: 26,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  displayMd: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  title2: {
    fontFamily: fonts.semiBold,
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  headline: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  bodySm: {
    fontFamily: fonts.regular,
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 18,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 16,
  },
  button: {
    fontFamily: fonts.medium,
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: -0.1,
    lineHeight: 17,
  },
  sectionHeader: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 18,
  },
  eyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
  },
} as const;

// Timing
export const timing = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// Shadows
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  dropdown: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export interface AppTheme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  fonts: typeof fonts;
  typography: typeof typography;
  shadows: typeof shadows;
  timing: typeof timing;
}

export interface ThemeContextType {
  theme: AppTheme;
  mode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const THEME_STORE_KEY = 'user_theme_mode';

const ThemeContext = createContext<ThemeContextType>({
  theme: {
    colors: darkColors,
    spacing,
    radii,
    fonts,
    typography,
    shadows,
    timing,
  },
  mode: 'dark',
  setThemeMode: () => {},
  isDark: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const systemColorScheme = useRNColorScheme();

  useEffect(() => {
    (async () => {
      try {
        const storedMode = await SecureStore.getItemAsync(THEME_STORE_KEY);
        if (storedMode === 'light' || storedMode === 'dark' || storedMode === 'system') {
          setModeState(storedMode as ThemeMode);
        }
      } catch (err) {
        console.warn('Failed to load theme mode from SecureStore', err);
      }
    })();
  }, []);

  const setThemeMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    SecureStore.setItemAsync(THEME_STORE_KEY, newMode).catch(err => {
      console.warn('Failed to save theme mode to SecureStore', err);
    });
  };

  const isDark = useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark';
    }
    return mode === 'dark';
  }, [mode, systemColorScheme]);

  const activeColors = isDark ? darkColors : lightColors;

  const theme: AppTheme = useMemo(() => ({
    colors: activeColors,
    spacing,
    radii,
    fonts,
    typography,
    shadows,
    timing,
  }), [activeColors]);

  const contextValue = useMemo(() => ({
    theme,
    mode,
    setThemeMode,
    isDark,
  }), [theme, mode, isDark]);

  return React.createElement(ThemeContext.Provider, { value: contextValue }, children);
}

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
