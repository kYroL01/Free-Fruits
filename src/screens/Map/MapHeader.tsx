import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { AppText, StatusDot } from '@/components/ui';
import { t } from '@/i18n';

export type LocationBarState = 'ok' | 'locating' | 'off';

type MapHeaderProps = {
  cityLabel: string;
  state: LocationBarState;
  onFilterPress: () => void;
  dark: boolean;
  onToggleTheme: () => void;
};

const KICKER_KEY_BY_STATE: Record<LocationBarState, string> = {
  ok: 'map.nearestCityAuto',
  locating: 'map.locatingNoFix',
  off: 'map.locationOffCityCentre',
};

/** Floating location bar + theme toggle, pinned above the map. */
export function MapHeader({ cityLabel, state, onFilterPress, dark, onToggleTheme }: MapHeaderProps) {
  const { tokens } = useTheme();
  const dotColor = state === 'ok' ? tokens.green : tokens.gold;

  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <View
        style={[
          {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: tokens.surface,
            borderRadius: radii.pill,
            paddingVertical: 11,
            paddingHorizontal: 13,
          },
          shadows.floatingHeader,
        ]}
      >
        <StatusDot color={dotColor} size={8} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="microLabel" dim>
            {t(KICKER_KEY_BY_STATE[state])}
          </AppText>
          <AppText variant="rowTitle">{state === 'locating' ? t('map.findingYou') : cityLabel}</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('map.filter')}
          onPress={onFilterPress}
          hitSlop={8}
          style={{
            minHeight: 32,
            paddingHorizontal: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: tokens.fuchsia,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText variant="microLabel" color={tokens.fuchsia}>
            {t('map.filter')}
          </AppText>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        onPress={onToggleTheme}
        style={[
          {
            width: 44,
            height: 44,
            borderRadius: radii.pill,
            backgroundColor: tokens.surface,
            alignItems: 'center',
            justifyContent: 'center',
          },
          shadows.floatingHeader,
        ]}
      >
        <AppText variant="microLabel">{dark ? t('map.themeLight') : t('map.themeDark')}</AppText>
      </Pressable>
    </View>
  );
}
