import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { useAppStore } from '@/store';
import { checkPassword, isValidPassword, PASSWORD_MIN_LENGTH } from '@/domain/rules';
import { t } from '@/i18n';
import { AppText, Button, Kicker, TextField } from '@/components/ui';
import { signOut, updatePassword } from '@/server/auth';

/** One row per house rule, ticked live as the user types — a single error message can't show
 * which of the three is still missing. Never colour alone: the mark carries the state too. */
function PasswordRules({ password }: { password: string }) {
  const { tokens } = useTheme();
  const touched = password.length > 0;

  return (
    <View style={{ gap: 4 }}>
      {checkPassword(password).map((check) => (
        <View key={check.id} style={{ flexDirection: 'row', gap: 8 }}>
          <AppText
            variant="microLabel"
            color={touched && check.met ? tokens.green : tokens.dim}
          >
            {touched && check.met ? '✓' : '·'}
          </AppText>
          <AppText
            variant="microLabel"
            color={touched && check.met ? tokens.green : tokens.dim}
          >
            {t(`auth.rule_${check.id}`, { count: PASSWORD_MIN_LENGTH })}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export function SetPasswordScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const recoveryMode = useAppStore((s) => s.recoveryMode);
  const setRecoveryMode = useAppStore((s) => s.setRecoveryMode);

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function validate(): boolean {
    const next: Record<string, string | null> = {
      currentPassword:
        recoveryMode || currentPassword.length > 0 ? null : t('auth.errorCurrentPasswordRequired'),
      password: isValidPassword(password) ? null : t('auth.errorPasswordPolicy'),
      confirmation: password === confirmation ? null : t('auth.errorPasswordsDiffer'),
    };
    setFieldErrors(next);
    return Object.values(next).every((value) => value === null);
  }

  async function onSubmit() {
    setError(null);
    if (!validate()) return;

    setPending(true);
    const result = await updatePassword(password, recoveryMode ? undefined : currentPassword);
    setPending(false);

    if (result.outcome === 'error') {
      setError(t(result.messageKey));
      return;
    }
    if (!recoveryMode) {
      router.back();
      return;
    }
    // USER_UPDATED clears the flag too, but the recovery flow can't wait on an event to fire
    // before it navigates — clearing it here is what lets index route on to the map.
    setRecoveryMode(false);
    router.replace('/');
  }

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
        <AppText variant="screenTitle">{t('auth.setPasswordTitle')}</AppText>
        <AppText variant="body" dim>
          {recoveryMode ? t('auth.setPasswordRecoveryBody') : t('auth.setPasswordChangeBody')}
        </AppText>

        {error ? (
          <View
            accessibilityRole="alert"
            style={{ padding: 12, borderRadius: 12, backgroundColor: tokens.fuchsiaSoft }}
          >
            <AppText variant="body" color={tokens.fuchsia}>
              {error}
            </AppText>
          </View>
        ) : null}

        <View style={{ gap: 14 }}>
          {!recoveryMode ? (
            <TextField
              label={t('auth.currentPasswordLabel')}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              error={fieldErrors.currentPassword}
              editable={!pending}
            />
          ) : null}

          <TextField
            label={t('auth.newPasswordLabel')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            error={fieldErrors.password}
            editable={!pending}
          />

          <PasswordRules password={password} />

          <TextField
            label={t('auth.confirmPasswordLabel')}
            value={confirmation}
            onChangeText={setConfirmation}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            error={fieldErrors.confirmation}
            editable={!pending}
            onSubmitEditing={onSubmit}
            returnKeyType="go"
          />
        </View>

        <Button label={t('auth.savePassword')} loading={pending} onPress={onSubmit} />

        <View style={{ flex: 1 }} />

        {/* A recovery session has no way back other than out: the guard pins this screen. */}
        <AppText
          variant="microLabel"
          dim
          style={{ textAlign: 'center' }}
          onPress={pending ? undefined : recoveryMode ? signOut : () => router.back()}
        >
          {recoveryMode ? t('auth.cancelRecovery') : t('common.cancel')}
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
