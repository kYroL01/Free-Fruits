import { Pressable, type PressableProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { lightHaptic } from '@/utils/haptics';
import { AppText } from './AppText';

type ChipProps = PressableProps & {
  label: string;
  active: boolean;
  /** Fill/border colour when active — defaults to fuchsia, pass a rarity colour for rarity chips. */
  activeColor?: string;
  count?: number;
};

/** Filter chip. Selecting fills with `activeColor`; unselected chips are a neutral outline.
 * Within a chip group, all-off means "no constraint" — never render a chip group state that
 * silently blanks the map. */
export function Chip({ label, active, activeColor, count, style, onPress, ...rest }: ChipProps) {
  const { tokens } = useTheme();
  const tint = activeColor ?? tokens.fuchsia;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      hitSlop={4}
      onPress={(e) => {
        lightHaptic();
        onPress?.(e);
      }}
      style={({ pressed }) => [
        {
          minHeight: 44,
          paddingHorizontal: 14,
          borderRadius: radii.pill,
          borderWidth: active ? 1.5 : 1,
          borderColor: active ? tint : tokens.line,
          backgroundColor: active ? tint : 'transparent',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 6,
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 1,
        },
        typeof style === 'function' ? undefined : style,
      ]}
      {...rest}
    >
      <AppText variant="rowLabel" color={active ? '#FFFFFF' : tokens.text}>
        {label}
        {count !== undefined ? ` · ${count}` : ''}
      </AppText>
    </Pressable>
  );
}
