import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme/ThemeProvider';

type SegmentedProgressProps = {
  segments: number;
  filled: number;
  height?: number;
  color?: string;
  gap?: number;
};

/** Verification progress (4 segments), add-tree step progress (3 segments), onboarding dots. */
export function SegmentedProgress({
  segments,
  filled,
  height = 5,
  color,
  gap = 4,
}: SegmentedProgressProps) {
  const { tokens } = useTheme();
  const tint = color ?? tokens.fuchsia;
  return (
    <View style={{ flexDirection: 'row', gap }}>
      {Array.from({ length: segments }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height,
            borderRadius: height / 2,
            backgroundColor: tint,
            opacity: i < filled ? 1 : 0.25,
          }}
        />
      ))}
    </View>
  );
}

type BarProgressProps = {
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  gradientColors?: [string, string];
};

/** Continuous tier/reward progress bar. Pass gradientColors for the green->fuchsia tier bar. */
export function BarProgress({
  progress,
  height = 8,
  trackColor,
  fillColor,
  gradientColors,
}: BarProgressProps) {
  const { tokens } = useTheme();
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: trackColor ?? tokens.surface2,
        overflow: 'hidden',
      }}
    >
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${pct * 100}%`, height: '100%', borderRadius: height / 2 }}
        />
      ) : (
        <View
          style={{
            width: `${pct * 100}%`,
            height: '100%',
            backgroundColor: fillColor ?? tokens.fuchsia,
            borderRadius: height / 2,
          }}
        />
      )}
    </View>
  );
}
