import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAppStore } from '@/store';
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
    pending === 'community_check' ? 'PENDING COMMUNITY CHECK' : 'POINTS HELD · DUPLICATE REVIEW';
  const body =
    pending === 'community_check'
      ? 'Two on-site confirmations turn this from pending to verified. You keep permanent credit either way.'
      : 'A finder and two nearby foragers will review the claim. Points land once it is resolved.';

  const close = (path: '/points' | '/map') => {
    closeModal();
    router.push(path);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#D4148B', padding: 18, justifyContent: 'flex-end', gap: 16, paddingBottom: 48 }}>
      <Kicker color="#FFFFFF">{kicker}</Kicker>
      <AppText variant="successHeadline" color="#FFFFFF">
        Nice find.
      </AppText>
      <AppText variant="pointsBig" color="#F7EBCF" style={{ fontSize: 54 }}>
        +{points}
      </AppText>
      <AppText variant="microLabel" color="#FFFFFF">
        STRAWBERRY POINTS
      </AppText>
      <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />
      <AppText variant="body" color="rgba(255,255,255,0.85)">
        {body}
      </AppText>
      <Button label="See my points" variant="onFuchsia" onPress={() => close('/points')} />
      <Button label="Back to map" variant="ghostOnFuchsia" onPress={() => close('/map')} />
    </View>
  );
}
