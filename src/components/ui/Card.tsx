import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

type CardProps = ViewProps & {
  padding?: number;
  radius?: number;
  elevated?: boolean;
  tint?: string;
};

export function Card({ padding = 16, radius = radii.card, elevated = true, tint, style, ...rest }: CardProps) {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: tint ?? tokens.surface,
          borderRadius: radius,
          padding,
        },
        elevated && shadows.card,
        style,
      ]}
      {...rest}
    />
  );
}
