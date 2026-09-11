import { TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { AppText } from './AppText';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  /** Rendered under the field in fuchsia; also flips the border so the error isn't colour-only. */
  error?: string | null;
};

export function TextField({ label, error, ...rest }: TextFieldProps) {
  const { tokens } = useTheme();

  return (
    <View style={{ gap: 6 }}>
      <AppText variant="microLabel" dim>
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={tokens.dim}
        style={{
          minHeight: 52,
          borderWidth: 1.5,
          borderColor: error ? tokens.fuchsia : tokens.line,
          borderRadius: radii.pill,
          paddingHorizontal: 16,
          paddingVertical: 14,
          color: tokens.text,
          backgroundColor: tokens.surface,
        }}
        {...rest}
      />
      {error ? (
        <AppText variant="microLabel" color={tokens.fuchsia}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
