import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Feather } from '@expo/vector-icons';
import { lightColors as colors, fonts, spacing, radii, typography } from '@/lib/theme';

// Required for Expo web browser auth session
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: githubAuth } = useOAuth({ strategy: 'oauth_github' });
  
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const onSelectAuth = async (strategy: 'oauth_google' | 'oauth_github') => {
    setLoading(strategy);
    setError('');
    
    try {
      const selectedAuth = strategy === 'oauth_google' ? googleAuth : githubAuth;
      const { createdSessionId, setActive } = await selectedAuth({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: 'mobile' }),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      } else {
        setError('Login membutuhkan verifikasi tambahan (2FA). Metodenya tidak didukung OAuth langsung.');
      }
    } catch (err: any) {
      console.error("OAuth error", err);
      setError(err.errors?.[0]?.message || 'Gagal login melalui OAuth.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.content}>
        
        {/* Logo / Brand */}
        <View style={s.brandBox}>
          <Text style={s.brandText}>DevWannaSpace</Text>
        </View>

        <View style={s.header}>
          <Text style={s.title}>Welcome back.</Text>
          <Text style={s.subtitle}>Sign in to access your workspace.</Text>
        </View>

        {error ? <Text style={s.errorText}>{error}</Text> : null}

        <View style={s.form}>
          <TouchableOpacity 
            style={[s.button, s.googleBtn, loading && loading !== 'oauth_google' && s.buttonDisabled]} 
            onPress={() => onSelectAuth('oauth_google')} 
            disabled={!!loading}
            activeOpacity={0.8}
          >
            {loading === 'oauth_google' ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <>
                <Feather name="chrome" size={20} color={colors.ink} style={s.btnIcon} />
                <Text style={[s.buttonText, s.googleBtnText]}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[s.button, s.githubBtn, loading && loading !== 'oauth_github' && s.buttonDisabled]} 
            onPress={() => onSelectAuth('oauth_github')} 
            disabled={!!loading}
            activeOpacity={0.8}
          >
            {loading === 'oauth_github' ? (
              <ActivityIndicator color={colors.canvas} />
            ) : (
              <>
                <Feather name="github" size={20} color={colors.canvas} style={s.btnIcon} />
                <Text style={[s.buttonText, s.githubBtnText]}>Continue with GitHub</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={s.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  brandBox: {
    width: 64,
    height: 64,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  brandText: {
    color: colors.canvas,
    fontFamily: fonts.semiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    letterSpacing: -1,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkSecondary,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
    backgroundColor: colors.dangerBg,
    padding: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.danger,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
  button: {
    height: 52,
    borderRadius: radii.none,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },
  githubBtn: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  btnIcon: {
    marginRight: spacing.sm,
  },
  buttonText: {
    ...typography.body,
    fontFamily: fonts.semiBold,
  },
  googleBtnText: {
    color: colors.ink,
  },
  githubBtnText: {
    color: colors.canvas,
  },
  footerText: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
