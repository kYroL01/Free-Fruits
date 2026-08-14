import { Stack } from 'expo-router';

import { AddTreeFlow } from '@/screens/AddTree/AddTreeFlow';

export default function AddTreeRoute() {
  return (
    <>
      <Stack.Screen options={{ presentation: 'fullScreenModal', headerShown: false }} />
      <AddTreeFlow />
    </>
  );
}
