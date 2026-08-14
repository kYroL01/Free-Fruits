import { Pressable, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { AppText } from '@/components/ui';
import { t } from '@/i18n';

type TabKey = 'map' | 'points' | 'alerts' | 'you';

const TABS: { key: TabKey; label: string; path: '/map' | '/points' | '/alerts' | '/you' }[] = [
  { key: 'map', label: t('nav.map'), path: '/map' },
  { key: 'points', label: t('nav.points'), path: '/points' },
  { key: 'alerts', label: t('nav.alerts'), path: '/alerts' },
  { key: 'you', label: t('nav.you'), path: '/you' },
];

function TabIcon({ tab, color }: { tab: TabKey; color: string }) {
  switch (tab) {
    case 'map':
      return (
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Path
            d="M2 5.5 6.5 3l5 2.5L16 3v9.5l-4.5 2.5-5-2.5L2 15V5.5Z"
            stroke={color}
            strokeWidth={1.6}
            fill="none"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'points':
      return (
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Circle cx={9} cy={9} r={6.5} stroke={color} strokeWidth={1.6} fill="none" />
          <Path d="M9 5.5v7M6.5 8h5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
      );
    case 'alerts':
      return (
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Path
            d="M9 2.5c-2.2 0-3.5 1.7-3.5 4v2.5L4 12h10l-1.5-3V6.5c0-2.3-1.3-4-3.5-4Z"
            stroke={color}
            strokeWidth={1.6}
            fill="none"
            strokeLinejoin="round"
          />
          <Path d="M7.5 14.5a1.5 1.5 0 0 0 3 0" stroke={color} strokeWidth={1.6} fill="none" />
        </Svg>
      );
    case 'you':
      return (
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Circle cx={9} cy={6} r={3} stroke={color} strokeWidth={1.6} fill="none" />
          <Path d="M3 15c0-3 2.7-5 6-5s6 2 6 5" stroke={color} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </Svg>
      );
  }
}

/** Custom tab bar: MAP · POINTS · [+FAB] · ALERTS · YOU. The FAB is not a router tab — it's an
 * absolutely-positioned pressable that pushes /add-tree directly. */
export function TabBar() {
  const { tokens } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const active = (TABS.find((t) => pathname.startsWith(t.path))?.key ?? 'map') as TabKey;

  const barHeight = spacing.tabBarHeight;

  return (
    <View
      style={{
        height: barHeight + insets.bottom,
        flexDirection: 'row',
        backgroundColor: tokens.surface,
        borderTopWidth: 1,
        borderTopColor: tokens.line,
        paddingBottom: insets.bottom,
      }}
    >
      {TABS.slice(0, 2).map((tab) => (
        <TabBarButton key={tab.key} tab={tab} active={active === tab.key} onPress={() => router.push(tab.path)} />
      ))}

      <View style={{ width: 68 }} />

      {TABS.slice(2).map((tab) => (
        <TabBarButton key={tab.key} tab={tab} active={active === tab.key} onPress={() => router.push(tab.path)} />
      ))}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a tree"
        onPress={() => router.push('/add-tree')}
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: -26,
          top: -16,
          width: 52,
          height: 52,
          borderRadius: 18,
          backgroundColor: tokens.fuchsia,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadows.fab,
        }}
      >
        <AppText variant="screenTitle" color="#FFFFFF" style={{ fontSize: 26, lineHeight: 28 }}>
          +
        </AppText>
      </Pressable>
    </View>
  );
}

function TabBarButton({
  tab,
  active,
  onPress,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
  const color = active ? tokens.fuchsia : tokens.dim;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 44 }}
    >
      <TabIcon tab={tab.key} color={color} />
      <AppText variant="microLabel" color={color}>
        {tab.label}
      </AppText>
    </Pressable>
  );
}
