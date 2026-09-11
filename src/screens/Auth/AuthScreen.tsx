import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { checkPassword, isValidPassword, PASSWORD_MIN_LENGTH } from '@/domain/rules';
import { t } from '@/i18n';
import { AppText, Button, Kicker, TextField } from '@/components/ui';
import { isSupabaseConfigured } from '@/server/supabase';
import {
  sendPasswordReset,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  type AuthResult,
} from '@/server/auth';

export type AuthMode = 'signIn' | 'signUp';

type Pending = 'none' | 'email' | 'google' | 'reset';

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const { tokens } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [banner, setBanner] = useState<{ tone: 'error' | 'info'; text: string } | null>(null);
  const [pending, setPending] = useState<Pending>('none');

  const isSignUp = mode === 'signUp';

  /** Client-side checks only catch the obvious cases; the server is still the authority. */
  function validate(): boolean {
    const next: Record<string, string | null> = {
      email: isEmail(email) ? null : t('auth.errorInvalidEmail'),
      // Sign-in only checks that something was typed: a password predating the policy is still
      // valid to sign in with, and only the server may reject it.
      password: isSignUp
        ? isValidPassword(password)
          ? null
          : t('auth.errorPasswordPolicy')
        : password.length > 0
          ? null
          : t('auth.errorPasswordRequired'),
      displayName:
        !isSignUp || displayName.trim().length > 0 ? null : t('auth.errorDisplayNameRequired'),
    };
    setFieldErrors(next);
    return Object.values(next).every((value) => value === null);
  }

  /** Success needs no handling: the auth listener flips `authStatus` and the guard navigates. */
  function handleResult(result: AuthResult) {
    switch (result.outcome) {
      case 'success':
        return;
      case 'confirm_email':
        setBanner({ tone: 'info', text: t('auth.checkYourEmail', { email: email.trim() }) });
        return;
      case 'cancelled':
        return;
      case 'error':
        setBanner({ tone: 'error', text: t(result.messageKey) });
        return;
    }
  }

  async function onSubmit() {
    setBanner(null);
    if (!validate()) return;

    setPending('email');
    const result = isSignUp
      ? await signUpWithEmail(email, password, displayName)
      : await signInWithEmail(email, password);
    setPending('none');
    handleResult(result);
  }

  async function onGoogle() {
    setBanner(null);
    setPending('google');
    const result = await signInWithGoogle();
    setPending('none');
    handleResult(result);
  }

  async function onForgotPassword() {
    setBanner(null);
    if (!isEmail(email)) {
      setFieldErrors({ email: t('auth.errorEmailForReset') });
      return;
    }
    setPending('reset');
    const result = await sendPasswordReset(email);
    setPending('none');
    if (result.outcome === 'success') {
      setBanner({ tone: 'info', text: t('auth.resetSent', { email: email.trim() }) });
      return;
    }
    handleResult(result);
  }

  const busy = pending !== 'none';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.screenH,
          paddingTop: spacing.screenTop,
          paddingBottom: spacing.screenBottom,
          gap: 18,
        }}
      >
        <Kicker>{t('auth.kicker')}</Kicker>
        <AppText variant="screenTitle">
          {isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}
        </AppText>
        <AppText variant="body" dim>
          {isSignUp ? t('auth.signUpBody') : t('auth.signInBody')}
        </AppText>

        {!isSupabaseConfigured ? (
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: tokens.goldSoft,
              gap: 4,
            }}
          >
            <AppText variant="microLabel" color={tokens.gold}>
              {t('auth.errorNotConfigured')}
            </AppText>
          </View>
        ) : null}

        {banner ? (
          <View
            accessibilityRole="alert"
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: banner.tone === 'error' ? tokens.fuchsiaSoft : tokens.greenSoft,
            }}
          >
            <AppText
              variant="body"
              color={banner.tone === 'error' ? tokens.fuchsia : tokens.green}
            >
              {banner.text}
            </AppText>
          </View>
        ) : null}

        <View style={{ gap: 14 }}>
          {isSignUp ? (
            <TextField
              label={t('auth.displayNameLabel')}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              placeholder={t('auth.displayNamePlaceholder')}
              error={fieldErrors.displayName}
              editable={!busy}
            />
          ) : null}

          <TextField
            label={t('auth.emailLabel')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            placeholder={t('auth.emailPlaceholder')}
            error={fieldErrors.email}
            editable={!busy}
          />

          <TextField
            label={t('auth.passwordLabel')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            textContentType={isSignUp ? 'newPassword' : 'password'}
            placeholder={
              isSignUp
                ? t('auth.passwordHint', { count: PASSWORD_MIN_LENGTH })
                : t('auth.passwordPlaceholder')
            }
            error={fieldErrors.password}
            editable={!busy}
            onSubmitEditing={onSubmit}
            returnKeyType="go"
          />

          {isSignUp ? (
            <View style={{ gap: 4 }}>
              {checkPassword(password).map((check) => {
                const met = password.length > 0 && check.met;
                return (
                  <View key={check.id} style={{ flexDirection: 'row', gap: 8 }}>
                    <AppText variant="microLabel" color={met ? tokens.green : tokens.dim}>
                      {met ? '✓' : '·'}
                    </AppText>
                    <AppText variant="microLabel" color={met ? tokens.green : tokens.dim}>
                      {t(`auth.rule_${check.id}`, { count: PASSWORD_MIN_LENGTH })}
                    </AppText>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>

        <Button
          label={isSignUp ? t('auth.createAccount') : t('auth.signIn')}
          loading={pending === 'email'}
          disabled={busy && pending !== 'email'}
          onPress={onSubmit}
        />

        {!isSignUp ? (
          <AppText
            variant="microLabel"
            dim
            style={{ textAlign: 'center' }}
            onPress={busy ? undefined : onForgotPassword}
          >
            {pending === 'reset' ? t('auth.sending') : t('auth.forgotPassword')}
          </AppText>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: tokens.line }} />
          <AppText variant="microLabel" dim>
            {t('auth.or')}
          </AppText>
          <View style={{ flex: 1, height: 1, backgroundColor: tokens.line }} />
        </View>

        <Button
          label={t('auth.continueWithGoogle')}
          variant="ghost"
          loading={pending === 'google'}
          disabled={busy && pending !== 'google'}
          onPress={onGoogle}
        />

        <View style={{ flex: 1 }} />

        <AppText
          variant="microLabel"
          dim
          style={{ textAlign: 'center' }}
          onPress={() => router.replace(isSignUp ? '/sign-in' : '/sign-up')}
        >
          {isSignUp ? t('auth.haveAccount') : t('auth.noAccount')}
        </AppText>

        <AppText
          variant="microLabel"
          dim
          style={{ textAlign: 'center' }}
          onPress={() => router.push('/privacy')}
        >
          {t('auth.privacyNote')}
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
