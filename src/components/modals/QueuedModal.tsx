import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { t } from '@/i18n';
import { AppText, Button, Kicker } from '@/components/ui';

type QueuedModalProps = { points: number; queueCount: number };

export function QueuedModal({ points, queueCount }: QueuedModalProps) {
  const { tokens } = useTheme();
  const router = useRouter();
  const closeModal = useAppStore((s) => s.closeModal);

  const go = (path: '/map' | '/you') => {
    closeModal();
    router.push(path);
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg, padding: 18, justifyContent: 'flex-end', gap: 16, paddingBottom: 48 }}>
      <Kicker>{t('queued.savedOffline', { count: queueCount })}</Kicker>
      <AppText variant="successHeadline">{t('queued.uploadsItself')}</AppText>
      <AppText variant="pointsBig" color={tokens.gold} style={{ fontSize: 40 }}>
        +{points}
      </AppText>
      <AppText variant="microLabel" dim>
        {t('queued.heldOnThisPhone')}
      </AppText>
      <View style={{ height: 1, backgroundColor: tokens.line }} />
      <AppText variant="body" dim>
        {t('queued.body')}
      </AppText>
      <Button label={t('success.backToMap')} onPress={() => go('/map')} />
      <Button label={t('queued.seeWhatIsWaiting')} variant="ghost" onPress={() => go('/you')} />
    </View>
  );
}
