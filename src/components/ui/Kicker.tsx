import { AppText } from './AppText';

type KickerProps = {
  children: string;
  size?: 'section' | 'micro';
  color?: string;
};

/** Mono uppercase kickers are decoration — accessibleLabel carries the sentence-case name for
 * screen readers per the a11y spec ("mono uppercase labels must carry accessible names in
 * sentence case"). */
export function Kicker({ children, size = 'section', color }: KickerProps) {
  return (
    <AppText
      variant={size === 'section' ? 'sectionKicker' : 'microLabel'}
      color={color}
      dim={!color}
      accessibilityLabel={toSentenceCase(children)}
    >
      {children}
    </AppText>
  );
}

function toSentenceCase(value: string): string {
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
