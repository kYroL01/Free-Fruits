import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

type RadioRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** Radio list row — condition report reasons, duplicate-claim reason, precision setting. */
export function RadioRow({ label, selected, onPress }: RadioRowProps) {
  const { tokens } = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        minHeight: 44,
        paddingVertical: 8,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: selected ? tokens.fuchsia : tokens.line,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <View
            style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: tokens.fuchsia }}
          />
        ) : null}
      </View>
      <AppText variant="rowLabel" style={{ flex: 1 }}>
        {label}
      </AppText>
    </Pressable>
  );
}
