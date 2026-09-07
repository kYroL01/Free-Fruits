import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { AppText, Kicker } from '@/components/ui';
import { t } from '@/i18n';

const STEP_LABELS = ['300 M', '600 M', '2 KM', '5 KM', null];

type DistanceStepperProps = {
  step: 0 | 1 | 2 | 3 | 4;
  onChange: (step: 0 | 1 | 2 | 3 | 4) => void;
};

export function DistanceStepper({ step, onChange }: DistanceStepperProps) {
  const { tokens } = useTheme();

  return (
    <View style={{ gap: 10 }}>
      <Kicker>{t('filters.distance', { label: STEP_LABELS[step] ?? t('filters.cityWide') })}</Kicker>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {STEP_LABELS.map((rawLabel, i) => {
          const label = rawLabel ?? t('filters.cityWide');
          const active = i === step;
          return (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(i as 0 | 1 | 2 | 3 | 4)}
              style={{
                flex: 1,
                height: 6,
                borderRadius: radii.pill,
                backgroundColor: i <= step ? tokens.fuchsia : tokens.surface2,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
