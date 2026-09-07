import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAppStore } from '@/store';
import { t } from '@/i18n';
import { successHaptic } from '@/utils/haptics';
import { AppText, Button, Kicker } from '@/components/ui';

type SuccessModalProps = {
  points: number;
  pending: 'community_check' | 'duplicate_review';
};

export function SuccessModal({ points, pending }: SuccessModalProps) {
  const router = useRouter();
  const closeModal = useAppStore((s) => s.closeModal);

  useEffect(() => {
    successHaptic();
  }, []);

  const kicker =
    pending === 'community_check'
      ? t('success.kickerCommunityCheck')
      : t('success.kickerDuplicateReview');
  const body =
    pending === 'community_check'
      ? t('success.bodyCommunityCheck')
      : t('success.bodyDuplicateReview');

  const close = (path: '/points' | '/map') => {
    closeModal();
    router.push(path);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#D4148B', padding: 18, justifyContent: 'flex-end', gap: 16, paddingBottom: 48 }}>
      <Kicker color="#FFFFFF">{kicker}</Kicker>
      <AppText variant="successHeadline" color="#FFFFFF">
        {t('success.niceFind')}
      </AppText>
      <AppText variant="pointsBig" color="#F7EBCF" style={{ fontSize: 54 }}>
        +{points}
      </AppText>
      <AppText variant="microLabel" color="#FFFFFF">
        {t('success.strawberryPoints')}
      </AppText>
      <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />
      <AppText variant="body" color="rgba(255,255,255,0.85)">
        {body}
      </AppText>
      <Button label={t('success.seeMyPoints')} variant="onFuchsia" onPress={() => close('/points')} />
      <Button label={t('success.backToMap')} variant="ghostOnFuchsia" onPress={() => close('/map')} />
    </View>
  );
}
