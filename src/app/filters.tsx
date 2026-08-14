import { Stack } from 'expo-router';

import { FiltersScreen } from '@/screens/Filters/FiltersScreen';

export default function FiltersRoute() {
  return (
    <>
      <Stack.Screen options={{ presentation: 'modal', headerShown: false }} />
      <FiltersScreen />
    </>
  );
}
