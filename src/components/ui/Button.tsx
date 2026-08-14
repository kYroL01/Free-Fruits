import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'dark' | 'ghost' | 'onFuchsia' | 'ghostOnFuchsia';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  disabledLabel?: string;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  disabled,
  disabledLabel,
  loading,
  fullWidth = true,
  ...rest
}: ButtonProps) {
  const { tokens } = useTheme();

  const palette = (() => {
    if (disabled) {
      return { bg: tokens.surface2, fg: tokens.dim, borderColor: 'transparent' as string };
    }
    switch (variant) {
      case 'primary':
        return { bg: tokens.fuchsia, fg: '#FFFFFF', borderColor: 'transparent' };
      case 'dark':
        return { bg: tokens.text, fg: tokens.bg, borderColor: 'transparent' };
      case 'ghost':
        return { bg: 'transparent', fg: tokens.text, borderColor: tokens.line };
      case 'onFuchsia':
        return { bg: '#FFFFFF', fg: tokens.fuchsia, borderColor: 'transparent' };
      case 'ghostOnFuchsia':
        return { bg: 'transparent', fg: '#FFFFFF', borderColor: 'rgba(255,255,255,0.7)' };
    }
  })();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        minHeight: 52,
        borderRadius: radii.pill,
        backgroundColor: palette.bg,
        borderWidth: palette.borderColor === 'transparent' ? 0 : 1.5,
        borderColor: palette.borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        opacity: pressed ? 0.85 : 1,
      })}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <AppText variant="primaryButton" color={palette.fg}>
          {disabled && disabledLabel ? disabledLabel : label}
        </AppText>
      )}
    </Pressable>
  );
}
