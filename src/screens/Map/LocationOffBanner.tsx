import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing } from '@/theme/spacing';
import { AppText } from '@/components/ui';
import { t } from '@/i18n';

export function LocationOffBanner({ cityLabel, onTurnOn }: { cityLabel: string; onTurnOn: () => void }) {
  const { tokens } = useTheme();

  return (
    <View style={{ paddingHorizontal: spacing.screenH }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: tokens.goldSoft,
          borderRadius: radii.chip,
          padding: 12,
        }}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="microLabel" color={tokens.gold}>
            {t('map.gpsOff')}
          </AppText>
          <AppText variant="body" dim>
            {t('map.browsingFromCentre', { city: cityLabel })}
          </AppText>
        </View>
        <Pressable accessibilityRole="button" onPress={onTurnOn} hitSlop={8}>
          <AppText variant="microLabel" color={tokens.gold}>
            {t('map.turnOn')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
