import { Platform } from 'react-native';

type ShadowStyle = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

function shadow(
  offsetY: number,
  blur: number,
  color: string,
  opacity: number,
  elevation: number
): ShadowStyle {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: Platform.OS === 'android' ? 0 : opacity,
    shadowRadius: blur / 2,
    elevation,
  };
}

export const shadows = {
  card: shadow(10, 26, '#000000', 0.13, 6),
  floatingHeader: shadow(6, 20, '#000000', 0.1, 4),
  sheet: shadow(18, 50, '#000000', 0.32, 16),
  pin: shadow(4, 12, '#000000', 0.28, 4),
  fab: shadow(8, 20, '#D4148B', 0.4, 8),
  proximityCard: shadow(10, 28, '#000000', 0.22, 8),
} as const;
