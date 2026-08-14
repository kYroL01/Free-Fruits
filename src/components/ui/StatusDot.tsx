import { View } from 'react-native';

type StatusDotProps = {
  color: string;
  size?: number;
};

/** Colour-coded status dot. Rarity/status is always ALSO labelled in adjacent text — never
 * colour alone (a11y spec) — so this component intentionally carries no accessibility role. */
export function StatusDot({ color, size = 8 }: StatusDotProps) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
  );
}
