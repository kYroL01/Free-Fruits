import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing } from '@/theme/spacing';
import { AppText } from '@/components/ui';

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
            GPS OFF
          </AppText>
          <AppText variant="body" dim>
            Browsing from {cityLabel} centre. You can read pins, not log or check in.
          </AppText>
        </View>
        <Pressable accessibilityRole="button" onPress={onTurnOn} hitSlop={8}>
          <AppText variant="microLabel" color={tokens.gold}>
            TURN ON
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
