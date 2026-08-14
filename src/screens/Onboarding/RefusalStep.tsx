import { Linking, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { t } from '@/i18n';
import { AppText, Button, IconTile, Kicker, StatusDot } from '@/components/ui';

export function RefusalStep({ onBrowseWithoutIt }: { onBrowseWithoutIt: () => void }) {
  const { tokens } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg, padding: spacing.screenH, paddingTop: 80, gap: 18 }}>
      <IconTile tint={tokens.goldSoft} size={60} radius={19}>
        <AppText variant="cardTitle" color={tokens.gold}>
          !
        </AppText>
      </IconTile>

      <Kicker color={tokens.gold}>{t('onboarding.locationRefusedKicker')}</Kicker>
      <AppText variant="screenTitle">{t('onboarding.locationRefusedTitle')}</AppText>

      <View style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatusDot color={tokens.gold} />
          <View style={{ flex: 1 }}>
            <AppText variant="rowTitle">Logging a tree</AppText>
            <AppText variant="body" dim>
              The photo cannot prove anything without a location, so the pin is refused.
            </AppText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatusDot color={tokens.gold} />
          <View style={{ flex: 1 }}>
            <AppText variant="rowTitle">Checking in</AppText>
            <AppText variant="body" dim>
              We cannot tell you are within 25 m of the trunk.
            </AppText>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <Button label={t('onboarding.openSettings')} variant="dark" onPress={() => Linking.openSettings()} />
      <Button label={t('onboarding.browseWithoutIt')} variant="ghost" onPress={onBrowseWithoutIt} />
    </View>
  );
}
