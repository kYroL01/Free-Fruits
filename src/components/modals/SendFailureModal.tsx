import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { t } from '@/i18n';
import { AppText, Button, Card, IconTile, Kicker } from '@/components/ui';

export function SendFailureModal({ onRetry, onLater }: { onRetry: () => void; onLater: () => void }) {
  const { tokens } = useTheme();
  const closeModal = useAppStore((s) => s.closeModal);

  return (
    <View style={{ gap: 16 }}>
      <IconTile tint={tokens.goldSoft} size={44} radius={14}>
        <AppText variant="cardTitle" color={tokens.gold}>
          !
        </AppText>
      </IconTile>
      <Kicker>{t('sendFailure.kicker')}</Kicker>
      <AppText variant="sheetTitle">{t('sendFailure.title')}</AppText>
      <AppText variant="body" dim>
        {t('sendFailure.intro')}
      </AppText>
      <Card tint={tokens.surface2} elevated={false} style={{ padding: 12 }}>
        <AppText variant="body" dim>
          {t('sendFailure.body')}
        </AppText>
      </Card>
      <Button
        label={t('sendFailure.tryAgainNow')}
        variant="dark"
        onPress={() => {
          closeModal();
          onRetry();
        }}
      />
      <Button
        label={t('sendFailure.uploadItLater')}
        variant="ghost"
        onPress={() => {
          closeModal();
          onLater();
        }}
      />
    </View>
  );
}
