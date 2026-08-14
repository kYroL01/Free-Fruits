import { Redirect } from 'expo-router';

import { useAppStore } from '@/store';
import { OnboardingFlow } from '@/screens/Onboarding/OnboardingFlow';

export default function OnboardingRoute() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  if (hasOnboarded) return <Redirect href="/map" />;
  return <OnboardingFlow />;
}
