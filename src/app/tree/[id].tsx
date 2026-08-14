import { Stack, useLocalSearchParams } from 'expo-router';

import { TreeDetailScreen } from '@/screens/TreeDetail/TreeDetailScreen';

export default function TreeDetailRoute() {
  const { id, openReport } = useLocalSearchParams<{ id: string; openReport?: string }>();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TreeDetailScreen id={id} openReport={openReport === '1'} />
    </>
  );
}
