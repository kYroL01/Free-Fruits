import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { typography, type TypographyRole } from '@/theme/typography';

type AppTextProps = TextProps & {
  variant?: TypographyRole;
  color?: string;
  /** Rarity/status colours must never be the only signal — pair with visible text, never fade it. */
  dim?: boolean;
};

export function AppText({ variant = 'body', color, dim, style, ...rest }: AppTextProps) {
  const { tokens } = useTheme();
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={1.3}
      style={[typography[variant], { color: color ?? (dim ? tokens.dim : tokens.text) }, style]}
      {...rest}
    />
  );
}
