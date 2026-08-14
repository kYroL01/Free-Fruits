import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { AppText, Button, IconTile, Kicker } from '@/components/ui';

export type PermissionFact = { title: string; body: string };

export type PermissionStepConfig = {
  label: string;
  tint: string;
  title: string;
  body: string;
  facts: PermissionFact[];
  ctaLabel: string;
  skipLabel: string;
  footnote: string;
};

type PermissionStepProps = PermissionStepConfig & {
  stepIndex: number; // 0-based among the 3 permission dots
  onAllow: () => void;
  onSkip: () => void;
};

export function PermissionStep({
  label,
  tint,
  title,
  body,
  facts,
  ctaLabel,
  skipLabel,
  footnote,
  stepIndex,
  onAllow,
  onSkip,
}: PermissionStepProps) {
  const { tokens } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg, padding: spacing.screenH, paddingTop: 80, gap: 18 }}>
      <IconTile tint={tint} size={60} radius={19}>
        <AppText variant="microLabel" color={tokens.text}>
          {label}
        </AppText>
      </IconTile>

      <Kicker>{`Permission ${stepIndex + 1} of 3`}</Kicker>
      <AppText variant="screenTitle">{title}</AppText>
      <AppText variant="body" dim>
        {body}
      </AppText>

      <View style={{ gap: 10 }}>
        {facts.map((fact) => (
          <View
            key={fact.title}
            style={{ flexDirection: 'row', gap: 10, backgroundColor: tokens.surface, borderRadius: 14, padding: 14 }}
          >
            <View
              style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tokens.fuchsia, marginTop: 6 }}
            />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="rowTitle" style={{ fontSize: 12.5 }}>
                {fact.title}
              </AppText>
              <AppText variant="body" dim style={{ fontSize: 11.5 }}>
                {fact.body}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <AppText variant="body" dim style={{ textAlign: 'center' }}>
        {footnote}
      </AppText>
      <Button label={ctaLabel} onPress={onAllow} />
      <Pressable accessibilityRole="button" onPress={onSkip}>
        <AppText variant="microLabel" dim style={{ textAlign: 'center' }}>
          {skipLabel}
        </AppText>
      </Pressable>

      <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', paddingTop: 6 }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              width: i === stepIndex ? 18 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === stepIndex ? tokens.fuchsia : tokens.surface2,
            }}
          />
        ))}
      </View>
    </View>
  );
}
