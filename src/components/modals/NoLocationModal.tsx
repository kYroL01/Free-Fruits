import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { t } from '@/i18n';
import { AppText, Button, IconTile } from '@/components/ui';

export function NoLocationModal() {
  const { tokens } = useTheme();
  const router = useRouter();
  const closeModal = useAppStore((s) => s.closeModal);

  return (
    <View style={{ gap: 16 }}>
      <IconTile tint={tokens.goldSoft} size={44} radius={14}>
        <AppText variant="cardTitle" color={tokens.gold}>
          !
        </AppText>
      </IconTile>
      <AppText variant="sheetTitle">{t('noLocation.title')}</AppText>
      <AppText variant="body" dim>
        {t('noLocation.body')}
      </AppText>
      <Button label={t('noLocation.openCamera')} variant="dark" onPress={closeModal} />
      <Button
        label={t('noLocation.later')}
        variant="ghost"
        onPress={() => {
          closeModal();
          router.back();
        }}
      />
    </View>
  );
}
