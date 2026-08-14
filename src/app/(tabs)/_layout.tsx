import { Tabs } from 'expo-router';

import { TabBar } from '@/components/nav/TabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={() => <TabBar />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="map/index" />
      <Tabs.Screen name="points/index" />
      <Tabs.Screen name="alerts/index" />
      <Tabs.Screen name="you/index" />
    </Tabs>
  );
}
