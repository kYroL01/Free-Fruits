import { Redirect } from 'expo-router';

import { useAppStore } from '@/store';

/** The one place the entry order lives: tour, then account, then the map. */
export default function Index() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const signedIn = useAppStore((s) => s.authStatus === 'signedIn');
  const recoveryMode = useAppStore((s) => s.recoveryMode);

  if (!hasOnboarded) return <Redirect href="/onboarding" />;
  if (!signedIn) return <Redirect href="/sign-in" />;
  // A recovery session is signed in, but the only thing it may do is set a password.
  if (recoveryMode) return <Redirect href="/set-password" />;
  return <Redirect href="/map" />;
}
