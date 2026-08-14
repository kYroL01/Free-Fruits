import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { LatLng } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { rarityColor } from '@/theme/tokens';
import { shadows } from '@/theme/shadows';
import { timing, useReducedMotion } from '@/theme/motion';
import { MapBackground } from '@/components/map/MapBackground';
import { project, unproject } from '@/components/map/projection';
import { mediumHaptic } from '@/utils/haptics';

const PX_PER_METER = 4;
const PIN_SIZE = 34;

type DraggablePinMapProps = {
  photoLocation: LatLng;
  pin: LatLng;
  onPinChange: (pin: LatLng, movedMeters: number) => void;
};

/** Draggable pin for add-tree step 3 — pointer capture, scale 1.12 while held, position eases
 * 180ms on release. Snaps to nothing: the user's placement wins. */
export function DraggablePinMap({ photoLocation, pin, onPinChange }: DraggablePinMapProps) {
  const { tokens } = useTheme();
  const reducedMotion = useReducedMotion();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const initial = project(photoLocation, pin, PX_PER_METER);
  const translateX = useSharedValue(initial.x);
  const translateY = useSharedValue(initial.y);
  const startX = useSharedValue(initial.x);
  const startY = useSharedValue(initial.y);
  const scale = useSharedValue(1);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const commitPin = (x: number, y: number) => {
    const newPin = unproject(photoLocation, { x, y }, PX_PER_METER);
    const movedMeters = Math.hypot(x - initial.x, y - initial.y) / PX_PER_METER;
    mediumHaptic();
    onPinChange(newPin, movedMeters);
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      scale.value = reducedMotion ? 1.12 : withTiming(1.12, { duration: 120 });
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      scale.value = reducedMotion ? 1 : withTiming(1, timing.pinDrop);
      runOnJS(commitPin)(translateX.value, translateY.value);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - PIN_SIZE / 2 },
      { translateY: translateY.value - PIN_SIZE },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={{ height: 220, borderRadius: 20, overflow: 'hidden' }} onLayout={onLayout}>
      <MapBackground width={size.width} height={size.height} />
      <View
        style={{
          position: 'absolute',
          left: size.width / 2,
          top: size.height / 2,
          width: 0,
          height: 0,
        }}
      >
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              { position: 'absolute', width: PIN_SIZE, height: PIN_SIZE },
              animatedStyle,
            ]}
          >
            <View
              style={[
                {
                  width: PIN_SIZE,
                  height: PIN_SIZE,
                  borderRadius: PIN_SIZE / 2,
                  borderBottomLeftRadius: 4,
                  backgroundColor: rarityColor(tokens, 'rare'),
                  borderWidth: 2.5,
                  borderColor: tokens.surface,
                  transform: [{ rotate: '45deg' }],
                },
                shadows.pin,
              ]}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}
