import { useState } from 'react';

import { View } from 'react-native';
import * as Crypto from 'expo-crypto';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { t } from '@/i18n';
import { computeNewTreePoints } from '@/domain/rules';
import { confirmSameTree, submitDuplicateClaim, type DuplicateClaimReason } from '@/server/mockServer';
import { findSpecies } from '@/server/seedData/species';
import type { LatLng, Tree } from '@/domain/types';
import { AppText, Button, Card, RadioRow } from '@/components/ui';
import type { ActiveModal } from '@/store/slices/uiSlice';

type DuplicatePayload = Extract<ActiveModal, { type: 'duplicate' }>;

const REASON_LABEL: Record<DuplicateClaimReason, string> = {
  different_species: 'Different species',
  second_trunk: 'Second trunk, 8 m away',
  wrong_tree: 'Existing pin is on the wrong tree',
};

export function DuplicateModal(props: DuplicatePayload) {
  const { tokens } = useTheme();
  const closeModal = useAppStore((s) => s.closeModal);
  const openModal = useAppStore((s) => s.openModal);
  const candidate = useAppStore((s) => s.trees[props.candidateTreeId]);
  const patchTree = useAppStore((s) => s.patchTree);
  const upsertTree = useAppStore((s) => s.upsertTree);
  const addPoints = useAppStore((s) => s.addPoints);
  const userId = useAppStore((s) => s.userId);
  const finderHandle = useAppStore((s) => s.handle);
  const strikes = useAppStore((s) => s.strikes);

  const [step, setStep] = useState<1 | 2>(1);
  const [reason, setReason] = useState<DuplicateClaimReason | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!candidate) return null;

  const species = findSpecies(props.speciesId);
  const points = computeNewTreePoints(species);

  const sameTree = async () => {
    setSubmitting(true);
    const result = await confirmSameTree(candidate);
    patchTree(candidate.id, { confirmations: result.confirmations });
    addPoints(result.points);
    setSubmitting(false);
    closeModal();
    openModal({ type: 'success', points: result.points, pending: 'community_check' });
  };

  const submitClaim = async () => {
    if (!reason) return;
    setSubmitting(true);
    await submitDuplicateClaim(candidate, reason);

    const pin: LatLng = props.pin;
    const newTree: Tree = {
      id: Crypto.randomUUID(),
      speciesId: props.speciesId,
      rarity: species?.rarity ?? 'unrated',
      points,
      location: pin,
      street: props.street,
      finderId: userId,
      finderHandle,
      confirmations: 0,
      confirmationsNeeded: 2,
      pending: true,
      fence: false,
      photoUri: props.photoUri,
      latestReport: null,
      createdAt: props.takenAt,
    };
    upsertTree(newTree);
    // A strike only applies if this claim is later rejected by the reviewing jury — there's no
    // reviewer flow in this mock build, so it never fires here.

    setSubmitting(false);
    closeModal();
    openModal({ type: 'success', points, pending: 'duplicate_review' });
  };

  return (
    <View style={{ gap: 16 }}>
      {step === 1 ? (
        <>
          <AppText variant="sheetTitle">{t('duplicate.title')}</AppText>
          <Card tint={tokens.surface2} elevated={false} style={{ gap: 4 }}>
            <AppText variant="cardTitle">{findSpecies(candidate.speciesId)?.name ?? t('filters.rarityUnrated')}</AppText>
            <AppText variant="body" dim>
              {candidate.street} · found by {candidate.finderHandle}
            </AppText>
          </Card>
          <Button label={t('duplicate.sameTree')} onPress={sameTree} loading={submitting} />
          <Button label={t('duplicate.itsANewOne')} variant="ghost" onPress={() => setStep(2)} />
        </>
      ) : (
        <>
          <AppText variant="sheetTitle">{t('duplicate.tellUsHowItDiffers')}</AppText>
          <View>
            {(Object.keys(REASON_LABEL) as DuplicateClaimReason[]).map((r) => (
              <RadioRow key={r} label={REASON_LABEL[r]} selected={reason === r} onPress={() => setReason(r)} />
            ))}
          </View>
          <Card tint={tokens.goldSoft} elevated={false}>
            <AppText variant="body" color={tokens.gold}>
              The original finder reviews this. A rejected claim costs nothing on its own —
              three rejected claims: −5 points.
            </AppText>
          </Card>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i < strikes ? tokens.gold : tokens.surface2,
                }}
              />
            ))}
          </View>
          <Button label={t('duplicate.submitForReview')} disabled={!reason} loading={submitting} onPress={submitClaim} />
        </>
      )}
    </View>
  );
}
