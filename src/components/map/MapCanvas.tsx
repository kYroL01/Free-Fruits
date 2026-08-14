import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import type { LatLng } from '@/domain/types';
import type { Rarity } from '@/theme/tokens';
import { MapBackground } from './MapBackground';
import { Pin } from './Pin';
import { project } from './projection';
import { UserLocationDot } from './UserLocationDot';

export type MapMarker = {
  id: string;
  location: LatLng;
  rarity: Rarity;
  initial: string;
  label: string;
};

type MapCanvasProps = {
  /** The point at the centre of the viewport. */
  center: LatLng;
  markers: MapMarker[];
  userLocation: LatLng | null;
  onMarkerPress: (id: string) => void;
  /** Pixels per metre — larger = more zoomed in. */
  pxPerMeter?: number;
};

/** Fixed, non-scrolling stylised map (matches the design prototype's decorative CSS-shape
 * approach — no map SDK, no API key). Swappable for react-native-maps or a real vector-tile SDK
 * later behind this same props contract. */
export function MapCanvas({ center, markers, userLocation, onMarkerPress, pxPerMeter = 3 }: MapCanvasProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const originX = size.width / 2;
  const originY = size.height / 2;

  return (
    <View style={{ flex: 1, overflow: 'hidden' }} onLayout={onLayout}>
      <MapBackground width={size.width} height={size.height} />

      {size.width > 0 &&
        markers.map((marker) => {
          const offset = project(center, marker.location, pxPerMeter);
          return (
            <Pin
              key={marker.id}
              rarity={marker.rarity}
              initial={marker.initial}
              label={marker.label}
              x={originX + offset.x}
              y={originY + offset.y}
              onPress={() => onMarkerPress(marker.id)}
            />
          );
        })}

      {size.width > 0 && userLocation && (
        <UserLocationDot
          x={originX + project(center, userLocation, pxPerMeter).x}
          y={originY + project(center, userLocation, pxPerMeter).y}
        />
      )}
    </View>
  );
}
