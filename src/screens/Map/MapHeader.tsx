import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { AppText, StatusDot } from '@/components/ui';

export type LocationBarState = 'ok' | 'locating' | 'off';

type MapHeaderProps = {
  cityLabel: string;
  state: LocationBarState;
  onFilterPress: () => void;
  dark: boolean;
  onToggleTheme: () => void;
};

const KICKER_BY_STATE: Record<LocationBarState, string> = {
  ok: 'Nearest city · auto',
  locating: 'Locating · no fix yet',
  off: 'Location off · city centre',
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
            {KICKER_BY_STATE[state]}
          </AppText>
          <AppText variant="rowTitle">{state === 'locating' ? 'Finding you…' : cityLabel}</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter"
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
            FILTER
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
        <AppText variant="microLabel">{dark ? 'LIGHT' : 'DARK'}</AppText>
      </Pressable>
    </View>
  );
}
