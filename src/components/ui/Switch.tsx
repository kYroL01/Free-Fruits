import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme/ThemeProvider';
import { timing, useReducedMotion } from '@/theme/motion';
import { lightHaptic } from '@/utils/haptics';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
};

const TRACK_W = 42;
const TRACK_H = 24;
const KNOB = 18;
const TRAVEL_OFF = 3;
const TRAVEL_ON = 21;

/** Toggle switch: 42x24 track, 18px knob, travel 3 -> 21, 180ms. */
export function Switch({ value, onValueChange, accessibilityLabel }: SwitchProps) {
  const { tokens } = useTheme();
  const reducedMotion = useReducedMotion();

  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: reducedMotion
          ? value
            ? TRAVEL_ON
            : TRAVEL_OFF
          : withTiming(value ? TRAVEL_ON : TRAVEL_OFF, timing.toggle),
      },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={() => {
        lightHaptic();
        onValueChange(!value);
      }}
      style={{
        width: TRACK_W,
        height: TRACK_H,
        borderRadius: TRACK_H / 2,
        backgroundColor: value ? tokens.fuchsia : tokens.surface2,
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            width: KNOB,
            height: KNOB,
            borderRadius: KNOB / 2,
            backgroundColor: '#FFFFFF',
            position: 'absolute',
          },
          knobStyle,
        ]}
      />
    </Pressable>
  );
}
