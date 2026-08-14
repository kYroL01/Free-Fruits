import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';

type HatchedPlaceholderProps = {
  width: number | string;
  height: number;
  radius?: number;
};

/** 45deg hatched placeholder for a tree photo that doesn't exist yet (mock data has no real
 * user photos). */
export function HatchedPlaceholder({ width, height, radius = 0 }: HatchedPlaceholderProps) {
  const { tokens } = useTheme();

  return (
    <Svg width={width} height={height} style={{ borderRadius: radius, overflow: 'hidden' }}>
      <Defs>
        <Pattern id="hatch" patternUnits="userSpaceOnUse" width={8} height={8} patternTransform="rotate(45)">
          <Line x1={0} y1={0} x2={0} y2={8} stroke={tokens.ph} strokeWidth={4} />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill={tokens.surface2} />
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#hatch)" />
    </Svg>
  );
}
