import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme/ThemeProvider';
import { haloPulse, useReducedMotion } from '@/theme/motion';

const DOT_SIZE = 16;
const HALO_SIZE = 44;

type UserLocationDotProps = { x: number; y: number };

/** User's live position: 16px fuchsia dot with a 3px white ring and a pulsing halo (scale
 * 1 -> 2.4, opacity .55 -> 0, 2.4s ease-out, infinite). Resolves to a static ring when the
 * device has "Reduce Motion" on — the pulse carries no information. */
export function UserLocationDot({ x, y }: UserLocationDotProps) {
  const { tokens } = useTheme();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(progress);
      return;
    }
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: haloPulse.durationMs, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    return () => cancelAnimation(progress);
  }, [progress, reducedMotion]);

  const haloStyle = useAnimatedStyle(() => {
    const scale = haloPulse.scaleFrom + progress.value * (haloPulse.scaleTo - haloPulse.scaleFrom);
    const opacity = reducedMotion
      ? haloPulse.opacityFrom * 0.6
      : haloPulse.opacityFrom + progress.value * (haloPulse.opacityTo - haloPulse.opacityFrom);
    return { transform: [{ scale }], opacity };
  });

  return (
    <View
      style={{
        position: 'absolute',
        left: x - HALO_SIZE / 2,
        top: y - HALO_SIZE / 2,
        width: HALO_SIZE,
        height: HALO_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: HALO_SIZE,
            height: HALO_SIZE,
            borderRadius: HALO_SIZE / 2,
            backgroundColor: tokens.fuchsia,
          },
          haloStyle,
        ]}
      />
      <View
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: tokens.fuchsia,
          borderWidth: 3,
          borderColor: '#FFFFFF',
        }}
      />
    </View>
  );
}
