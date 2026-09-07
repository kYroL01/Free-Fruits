import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { TIER_THRESHOLDS } from '@/domain/rules';
import type { Tier } from '@/domain/types';
import { AppText } from '@/components/ui';
import { t } from '@/i18n';

const TIERS: { key: Tier; labelKey: string }[] = [
  { key: 'sprout', labelKey: 'points.tierSprout' },
  { key: 'picker', labelKey: 'points.tierPicker' },
  { key: 'forager', labelKey: 'points.tierForager' },
  { key: 'orchardist', labelKey: 'points.tierOrchardist' },
];

export function TiersRow({ currentTier }: { currentTier: Tier }) {
  const { tokens } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {TIERS.map((tier) => {
        const isCurrent = tier.key === currentTier;
        return (
          <View
            key={tier.key}
            style={{
              flex: 1,
              alignItems: 'center',
              gap: 4,
              paddingVertical: 10,
              borderRadius: radii.chip,
              borderWidth: isCurrent ? 1.5 : 1,
              borderColor: isCurrent ? tokens.fuchsia : tokens.line,
            }}
          >
            <AppText variant="rowLabel">{t(tier.labelKey)}</AppText>
            <AppText variant="microLabel" dim>
              {TIER_THRESHOLDS[tier.key]}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}
