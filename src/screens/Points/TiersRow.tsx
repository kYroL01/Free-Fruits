import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { TIER_THRESHOLDS } from '@/domain/rules';
import type { Tier } from '@/domain/types';
import { AppText } from '@/components/ui';

const TIERS: { key: Tier; label: string }[] = [
  { key: 'sprout', label: 'Sprout' },
  { key: 'picker', label: 'Picker' },
  { key: 'forager', label: 'Forager' },
  { key: 'orchardist', label: 'Orchardist' },
];

export function TiersRow({ currentTier }: { currentTier: Tier }) {
  const { tokens } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {TIERS.map((t) => {
        const isCurrent = t.key === currentTier;
        return (
          <View
            key={t.key}
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
            <AppText variant="rowLabel">{t.label}</AppText>
            <AppText variant="microLabel" dim>
              {TIER_THRESHOLDS[t.key]}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}
