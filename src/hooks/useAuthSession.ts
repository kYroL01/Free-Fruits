import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';

import { useAppStore } from '@/store';
import { supabase, isSupabaseConfigured } from '@/server/supabase';
import { exchangeCodeFromUrl } from '@/server/auth';

function displayNameFrom(metadata: Record<string, unknown>, email: string | null): string {
  const fromMetadata = metadata.display_name ?? metadata.full_name ?? metadata.name;
  if (typeof fromMetadata === 'string' && fromMetadata.length > 0) return fromMetadata;
  return email?.split('@')[0] ?? '';
}

/**
 * Single owner of auth state: restores the stored session on cold start, then mirrors every
 * Supabase auth event into the store. Screens read `authStatus`/`account` and never the client.
 *
 * Returns false until the first restore settles, so the root layout can hold the splash screen.
 */
export function useAuthSession(): boolean {
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const setAccount = useAppStore((s) => s.setAccount);
  const setRecoveryMode = useAppStore((s) => s.setRecoveryMode);
  const adoptAccount = useAppStore((s) => s.adoptAccount);
  const resetProfile = useAppStore((s) => s.resetProfile);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // No backend wired up yet: fail open to signed-out rather than hanging on the splash.
      setAccount(null);
      return;
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // A recovery link opens a real session, so the only thing separating it from a normal
      // sign-in is this event. USER_UPDATED lands once the new password is written.
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
      if (event === 'USER_UPDATED' || event === 'SIGNED_OUT') setRecoveryMode(false);

      const user = session?.user ?? null;
      if (user) {
        const displayName = displayNameFrom(user.user_metadata ?? {}, user.email ?? null);
        setAccount({ id: user.id, email: user.email ?? null, displayName });
        adoptAccount(user.id, displayName);
      } else {
        setAccount(null);
        if (event === 'SIGNED_OUT') resetProfile();
      }
      setReady(true);
    });

    // onAuthStateChange fires INITIAL_SESSION on subscribe, but a client that errors while
    // reading the keychain would never emit it — this guarantees the splash is released.
    supabase.auth.getSession().then(() => setReady(true));

    return () => data.subscription.unsubscribe();
  }, [setAccount, setRecoveryMode, adoptAccount, resetProfile]);

  return ready;
}

/**
 * Confirmation and password-recovery links open the app at `freefruits://auth-callback?code=...`.
 * The OAuth flow consumes its own redirect inside `signInWithGoogle`, so only links that arrive
 * cold or while the app is backgrounded land here.
 */
export function useAuthDeepLink(): void {
  const url = Linking.useLinkingURL();
  const setRecoveryMode = useAppStore((s) => s.setRecoveryMode);

  useEffect(() => {
    if (!url || !isSupabaseConfigured) return;
    if (!url.includes('auth-callback') || !url.includes('code=')) return;

    // Supabase emits PASSWORD_RECOVERY for recovery links, but only when it can tell them apart
    // from a plain sign-in. When the redirect carries `type=recovery` we know first-hand.
    if (url.includes('type=recovery')) setRecoveryMode(true);
    exchangeCodeFromUrl(url);
  }, [url, setRecoveryMode]);
}
