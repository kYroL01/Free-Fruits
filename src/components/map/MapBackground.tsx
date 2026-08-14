import Svg, { Path, Rect } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';

type MapBackgroundProps = { width: number; height: number };

/** Stylised fake map background — CSS-shape approach carried over from the design prototype,
 * not real map tiles (no API key required). Loosely evokes Valencia: the Jardí del Túria park
 * corridor running through the city, and the Mediterranean coastline on the east edge. Actual
 * shape data is a placeholder impression, not a survey of the real city (flagged follow-up). */
export function MapBackground({ width, height }: MapBackgroundProps) {
  const { tokens } = useTheme();
  if (width <= 0 || height <= 0) return null;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Rect x={0} y={0} width={width} height={height} fill={tokens.land} />

      {/* Mediterranean coastline, east edge */}
      <Path
        d={`M ${width * 0.82} 0 C ${width * 0.9} ${height * 0.3}, ${width * 0.88} ${height * 0.7}, ${width * 0.98} ${height} L ${width} ${height} L ${width} 0 Z`}
        fill={tokens.water}
      />

      {/* Jardí del Túria park corridor, arcing through the city */}
      <Path
        d={`M 0 ${height * 0.62} C ${width * 0.28} ${height * 0.5}, ${width * 0.5} ${height * 0.58}, ${width * 0.72} ${height * 0.4} C ${width * 0.8} ${height * 0.34}, ${width * 0.85} ${height * 0.28}, ${width * 0.9} ${height * 0.18}`}
        stroke={tokens.park}
        strokeWidth={42}
        fill="none"
        strokeLinecap="round"
      />

      {/* A couple of arterial roads */}
      <Path
        d={`M ${width * 0.15} 0 L ${width * 0.35} ${height}`}
        stroke={tokens.road}
        strokeWidth={10}
        fill="none"
      />
      <Path
        d={`M 0 ${height * 0.35} L ${width} ${height * 0.5}`}
        stroke={tokens.road}
        strokeWidth={8}
        fill="none"
      />
      <Path
        d={`M 0 ${height * 0.78} L ${width * 0.7} ${height * 0.82}`}
        stroke={tokens.road}
        strokeWidth={8}
        fill="none"
      />
    </Svg>
  );
}
