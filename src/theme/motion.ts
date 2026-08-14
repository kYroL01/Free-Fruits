import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Easing, type WithTimingConfig } from 'react-native-reanimated';

/** Honors prefers-reduced-motion / "Reduce Motion" — halo pulse, skeleton shimmer, and pin-drop
 * easing must resolve to their static end state when this is true; none of them carry information. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}

export const durations = {
  toggleTravel: 180,
  pinDropEase: 180,
  scrimFade: 150,
  cardIn: 200,
} as const;

export const timing = {
  toggle: { duration: durations.toggleTravel, easing: Easing.out(Easing.ease) } satisfies WithTimingConfig,
  pinDrop: { duration: durations.pinDropEase, easing: Easing.out(Easing.ease) } satisfies WithTimingConfig,
  scrim: { duration: durations.scrimFade, easing: Easing.out(Easing.ease) } satisfies WithTimingConfig,
  card: { duration: durations.cardIn, easing: Easing.out(Easing.ease) } satisfies WithTimingConfig,
} as const;

/** User-location halo: scale 1 -> 2.4, opacity .55 -> 0, 2.4s ease-out, infinite. */
export const haloPulse = {
  durationMs: 2400,
  scaleFrom: 1,
  scaleTo: 2.4,
  opacityFrom: 0.55,
  opacityTo: 0,
} as const;
