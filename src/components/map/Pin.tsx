import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { rarityColor, type Rarity } from '@/theme/tokens';
import { shadows } from '@/theme/shadows';
import { AppText } from '@/components/ui';

const SIZE = 34;

type PinProps = {
  rarity: Rarity;
  initial: string;
  x: number;
  y: number;
  label: string;
  onPress: () => void;
};

/** Map pin — rotated-square teardrop anchored at its tip (bottom point), 34x34, 2.5px surface
 * border, fill = rarity colour, species initial counter-rotated upright. */
export function Pin({ rarity, initial, x, y, label, onPress }: PinProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${rarity}`}
      onPress={onPress}
      hitSlop={10}
      style={{
        position: 'absolute',
        left: x - SIZE / 2,
        top: y - SIZE, // anchor at the tip, not the centre
        width: SIZE,
        height: SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={[
          {
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            borderBottomLeftRadius: 4,
            backgroundColor: rarityColor(tokens, rarity),
            borderWidth: 2.5,
            borderColor: tokens.surface,
            transform: [{ rotate: '45deg' }],
          },
          shadows.pin,
        ]}
      />
      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="rowTitle" color="#FFFFFF" style={{ fontSize: 12 }}>
          {initial}
        </AppText>
      </View>
    </Pressable>
  );
}
