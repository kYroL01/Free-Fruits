import { useId } from 'react';
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import type { AvatarDef } from '@/domain/avatars';

type AvatarGlyphProps = {
  avatar: AvatarDef;
  /** Rendered size in points; the artwork is authored on a 100x100 grid and scales to it. */
  size: number;
};

/** The shading wash laid over the body, clipped to it — constant across every avatar. */
const SHADE = 'M0,56 C42,64 40,86 100,92 L100,110 L0,110 Z';

/**
 * Draws one of the eight illustrated plant avatars from `domain/avatars`. Gradient and clip ids
 * are scoped per instance so the same avatar can appear twice on screen (profile header and
 * picker grid) without the second one inheriting the first one's defs.
 */
export function AvatarGlyph({ avatar, size }: AvatarGlyphProps) {
  const uid = useId().replace(/:/g, '');
  const bodyFill = `avatar-${uid}-body`;
  const leafFill = `avatar-${uid}-leaf`;
  const clip = `avatar-${uid}-clip`;

  const bodyParts = [avatar.body, avatar.part2, avatar.part3].filter(Boolean);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id={bodyFill} x1="0" y1="0" x2="0.9" y2="1">
          <Stop offset="0" stopColor={avatar.bodyLight} />
          <Stop offset="1" stopColor={avatar.bodyDark} />
        </LinearGradient>
        <LinearGradient id={leafFill} x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor={avatar.leafLight} />
          <Stop offset="1" stopColor={avatar.leafDark} />
        </LinearGradient>
        <ClipPath id={clip}>
          {bodyParts.map((d, i) => (
            <Path key={i} d={d} />
          ))}
        </ClipPath>
      </Defs>

      {avatar.stem ? (
        <Path d={avatar.stem} stroke={avatar.leafDark} strokeWidth={3} fill="none" strokeLinecap="round" />
      ) : null}
      {avatar.leafA ? <Path d={avatar.leafA} fill={`url(#${leafFill})`} /> : null}
      {avatar.leafB ? <Path d={avatar.leafB} fill={`url(#${leafFill})`} opacity={0.85} /> : null}
      {avatar.vein ? (
        <Path d={avatar.vein} stroke="#FFFFFF" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.9} />
      ) : null}

      {bodyParts.map((d, i) => (
        <Path key={i} d={d} fill={`url(#${bodyFill})`} />
      ))}

      {bodyParts.length > 0 ? (
        <G clipPath={`url(#${clip})`}>
          <Path d={SHADE} fill={avatar.bodyDark} opacity={0.3} />
          {avatar.swoosh ? (
            <Path d={avatar.swoosh} stroke="#FFFFFF" strokeWidth={4.6} fill="none" strokeLinecap="round" />
          ) : null}
          {avatar.mark ? (
            <Path
              d={avatar.mark}
              stroke="#FFFFFF"
              strokeWidth={2.2}
              fill="none"
              strokeLinecap="round"
              opacity={0.75}
            />
          ) : null}
        </G>
      ) : null}
    </Svg>
  );
}
