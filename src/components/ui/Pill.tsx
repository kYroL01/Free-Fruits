import { Pressable, type PressableProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { AppText } from './AppText';

type PillProps = PressableProps & {
  label: string;
  color?: string;
};

/** Bordered mono pill — e.g. the map header's FILTER affordance: mono 10px, 1px border,
 * radius 8, coloured text on transparent fill. */
export function Pill({ label, color, style, ...rest }: PillProps) {
  const { tokens } = useTheme();
  const tint = color ?? tokens.fuchsia;
  const sentenceCase = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={sentenceCase}
      hitSlop={8}
      style={({ pressed }) => [
        {
          minHeight: 44,
          minWidth: 44,
          paddingHorizontal: 12,
          borderRadius: radii.chip,
          borderWidth: 1,
          borderColor: tint,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        },
        typeof style === 'function' ? undefined : style,
      ]}
      {...rest}
    >
      <AppText variant="microLabel" color={tint}>
        {label}
      </AppText>
    </Pressable>
  );
}
