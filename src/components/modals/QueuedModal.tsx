import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
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
      <Kicker>{`Saved offline · ${queueCount} in queue`}</Kicker>
      <AppText variant="successHeadline">It uploads itself.</AppText>
      <AppText variant="pointsBig" color={tokens.gold} style={{ fontSize: 40 }}>
        +{points}
      </AppText>
      <AppText variant="microLabel" dim>
        HELD ON THIS PHONE
      </AppText>
      <View style={{ height: 1, backgroundColor: tokens.line }} />
      <AppText variant="body" dim>
        The photo, GPS stamp, and species are saved on your device. It sends itself the moment
        you have signal — no need to open the app again.
      </AppText>
      <Button label="Back to map" onPress={() => go('/map')} />
      <Button label="See what is waiting" variant="ghost" onPress={() => go('/you')} />
    </View>
  );
}
