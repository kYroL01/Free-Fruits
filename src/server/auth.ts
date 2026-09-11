import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import type { AuthError, Session } from '@supabase/supabase-js';

import { isSupabaseConfigured, supabase } from './supabase';

export type AuthResult =
  | { outcome: 'success'; session: Session | null }
  /** Sign-up on a project with email confirmation on: no session until the link is opened. */
  | { outcome: 'confirm_email' }
  | { outcome: 'cancelled' }
  | { outcome: 'error'; messageKey: string; detail: string };

/** The redirect the OAuth provider and the confirmation email both come back to. Must match the
 * `scheme` in app.config.ts and be listed under Supabase Auth > URL Configuration. */
export const AUTH_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'freefruits',
  path: 'auth-callback',
});

const NOT_CONFIGURED: AuthResult = {
  outcome: 'error',
  messageKey: 'auth.errorNotConfigured',
  detail: 'EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY are unset',
};

/** Supabase error codes are stable; their messages are not, so the UI keys off the code. */
function toResult(error: AuthError): AuthResult {
  const keyByCode: Record<string, string> = {
    invalid_credentials: 'auth.errorInvalidCredentials',
    email_not_confirmed: 'auth.errorEmailNotConfirmed',
    user_already_exists: 'auth.errorEmailTaken',
    email_exists: 'auth.errorEmailTaken',
    weak_password: 'auth.errorWeakPassword',
    over_email_send_rate_limit: 'auth.errorRateLimited',
    over_request_rate_limit: 'auth.errorRateLimited',
    validation_failed: 'auth.errorInvalidEmail',
    same_password: 'auth.errorSamePassword',
    reauthentication_needed: 'auth.errorCurrentPasswordWrong',
    session_not_found: 'auth.errorRecoveryLinkExpired',
    session_expired: 'auth.errorRecoveryLinkExpired',
  };
  const key = (error.code && keyByCode[error.code]) ?? 'auth.errorGeneric';
  return { outcome: 'error', messageKey: key, detail: error.message };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: AUTH_REDIRECT_URI,
      data: { display_name: displayName.trim() },
    },
  });
  if (error) return toResult(error);
  if (!data.session) return { outcome: 'confirm_email' };
  return { outcome: 'success', session: data.session };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) return toResult(error);
  return { outcome: 'success', session: data.session };
}

/**
 * Google sign-in without the native SDK: Supabase hands back an authorize URL, the system browser
 * runs the consent screen, and the redirect carries a PKCE code this app exchanges for a session.
 * Keeps the project on Expo Go / a plain dev client — no google-services.json required.
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: AUTH_REDIRECT_URI,
      // We drive the browser ourselves so the redirect lands back inside the app.
      skipBrowserRedirect: true,
    },
  });
  if (error) return toResult(error);
  if (!data.url) {
    return { outcome: 'error', messageKey: 'auth.errorGeneric', detail: 'no authorize url' };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, AUTH_REDIRECT_URI);
  if (result.type !== 'success') return { outcome: 'cancelled' };

  return exchangeCodeFromUrl(result.url);
}

/** Shared by the OAuth return and by confirmation/recovery links opened from the mail app. */
export async function exchangeCodeFromUrl(url: string): Promise<AuthResult> {
  const code = new URL(url).searchParams.get('code');
  if (!code) return { outcome: 'cancelled' };

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return toResult(error);
  return { outcome: 'success', session: data.session };
}

/**
 * Writes a new password for the session that is already open — either a recovery session opened
 * by the emailed link, or a normal one when a signed-in user changes their password from the
 * profile. `currentPassword` is only passed in the second case: a recovery link has already
 * proved control of the mailbox, and the user reaching for it does not remember the old one.
 *
 * The policy in `@/domain/rules/password` is checked by the caller; Supabase enforces its own
 * minimum server-side, which is why `weak_password` is still mapped.
 */
export async function updatePassword(
  password: string,
  currentPassword?: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const { error } = await supabase.auth.updateUser(
    currentPassword ? { password, current_password: currentPassword } : { password }
  );
  if (error) return toResult(error);
  // The USER_UPDATED event carries the refreshed session; nothing to hand back here.
  return { outcome: 'success', session: null };
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: AUTH_REDIRECT_URI,
  });
  if (error) return toResult(error);
  return { outcome: 'success', session: null };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}
