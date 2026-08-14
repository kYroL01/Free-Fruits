import { Stack } from 'expo-router';

import { SearchScreen } from '@/screens/SearchResults/SearchScreen';

export default function SearchRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SearchScreen />
    </>
  );
}
