import { Stack } from 'expo-router';

import { PrivacyScreen } from '@/screens/Privacy/PrivacyScreen';

export default function PrivacyRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PrivacyScreen />
    </>
  );
}
