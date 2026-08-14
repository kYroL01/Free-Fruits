import { View, type ViewProps } from 'react-native';

type IconTileProps = ViewProps & {
  size?: number;
  radius?: number;
  tint: string;
};

/** Coloured tile holding a glyph — condition-card status, onboarding permission icon,
 * species/avatar initials. */
export function IconTile({ size = 30, radius = 10, tint, style, children, ...rest }: IconTileProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: tint,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
