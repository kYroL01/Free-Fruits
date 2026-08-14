import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { radii } from '@/theme/spacing';
import { useReducedMotion } from '@/theme/motion';

const CARD_WIDTH = 212;
const CARD_HEIGHT = 160;

function SkeletonCard({ delayMs }: { delayMs: number }) {
  const { tokens } = useTheme();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(reducedMotion ? 0.6 : 1);

  useEffect(() => {
    if (reducedMotion) return;
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
    return () => cancelAnimation(opacity);
  }, [opacity, delayMs, reducedMotion]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: radii.card,
          backgroundColor: tokens.surface2,
        },
        style,
      ]}
    />
  );
}

/** Skeleton carousel shown while the map has no GPS fix yet — 1.6s opacity pulse staggered
 * 0/.2/.4s, resolving to a static dim state under Reduce Motion. */
export function SkeletonCarousel() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: spacing.screenH }}>
      <SkeletonCard delayMs={0} />
      <SkeletonCard delayMs={200} />
      <SkeletonCard delayMs={400} />
    </View>
  );
}
