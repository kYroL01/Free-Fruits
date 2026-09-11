import { Redirect } from 'expo-router';

import { useAppStore } from '@/store';
import { OnboardingFlow } from '@/screens/Onboarding/OnboardingFlow';

export default function OnboardingRoute() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  // Index owns the "where next" decision — a finished tour may still need a sign-in.
  if (hasOnboarded) return <Redirect href="/" />;
  return <OnboardingFlow />;
}
