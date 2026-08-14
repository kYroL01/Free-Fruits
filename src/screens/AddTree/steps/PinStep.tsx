import { useState } from 'react';
import { View } from 'react-native';
import * as Crypto from 'expo-crypto';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { computeNewTreePoints } from '@/domain/rules';
import { submitNewTree } from '@/server/mockServer';
import type { LatLng, Species } from '@/domain/types';
import { AppText, Button, Card, Kicker } from '@/components/ui';
import { DraggablePinMap } from './DraggablePinMap';

type PinStepProps = {
  photoUri: string;
  exifGps: LatLng;
  takenAt: string;
  species: Species | null;
  unlistedName: string | null;
  onDone: () => void;
};

export function PinStep({ photoUri, exifGps, takenAt, species, unlistedName, onDone }: PinStepProps) {
  const { tokens } = useTheme();
  const { isConnected } = useNetworkStatus();
  const trees = useAppStore((s) => s.trees);
  const queue = useAppStore((s) => s.queue);
  const enqueue = useAppStore((s) => s.enqueue);
  const upsertTree = useAppStore((s) => s.upsertTree);
  const addPoints = useAppStore((s) => s.addPoints);
  const incrementTreeCount = useAppStore((s) => s.incrementTreeCount);
  const userId = useAppStore((s) => s.userId);
  const finderHandle = useAppStore((s) => s.handle);
  const openModal = useAppStore((s) => s.openModal);

  const [pin, setPin] = useState<LatLng>(exifGps);
  const [movedMeters, setMovedMeters] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const points = computeNewTreePoints(species);
  const label = species?.name ?? unlistedName ?? 'Unlisted tree';
  const rarity = species?.rarity ?? 'unrated';

  const queueForLater = () => {
    enqueue({
      id: Crypto.randomUUID(),
      photoUri,
      exifGps,
      speciesId: species?.id ?? 'unlisted',
      pin,
      takenAt,
      status: 'pending',
    });
    openModal({ type: 'queued', points, queueCount: queue.length + 1 });
    onDone();
  };

  const submit = async () => {
    if (!isConnected) {
      // Submitting while offline never silently fails, and never runs the duplicate check
      // (that needs the server) — it always surfaces the send-failure modal instead.
      openModal({ type: 'send_failure', onRetry: submit, onLater: queueForLater });
      return;
    }

    setSubmitting(true);
    const result = await submitNewTree({
      species,
      pin,
      photoUri,
      exifGps,
      finderId: userId,
      finderHandle,
      street: 'Nearby street', // no reverse-geocode wired up in this mock build yet
      existingTrees: Object.values(trees),
    });
    setSubmitting(false);

    if (result.outcome === 'no_location') {
      openModal({ type: 'no_location' });
      return;
    }

    if (result.outcome === 'duplicate') {
      openModal({
        type: 'duplicate',
        pin,
        speciesId: species?.id ?? 'unlisted',
        photoUri,
        street: 'Nearby street',
        takenAt,
        candidateTreeId: result.candidate.id,
      });
      return;
    }

    upsertTree(result.tree);
    addPoints(result.points);
    incrementTreeCount();
    openModal({ type: 'success', points: result.points, pending: 'community_check' });
    onDone();
  };

  return (
    <View style={{ flex: 1, gap: 18 }}>
      <DraggablePinMap
        photoLocation={exifGps}
        pin={pin}
        onPinChange={(newPin, moved) => {
          setPin(newPin);
          setMovedMeters(moved);
        }}
      />

      <View style={{ gap: 4 }}>
        <Kicker>{movedMeters > 1 ? 'Pin adjusted by hand' : 'Pin from photo metadata'}</Kicker>
        <AppText variant="body" dim>
          {movedMeters > 1
            ? `Moved ${Math.round(movedMeters)} m from the photo location`
            : 'Drag the pin if the trunk sits elsewhere'}
        </AppText>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Card style={{ flex: 1, gap: 4 }}>
          <AppText variant="microLabel" dim>
            SPECIES
          </AppText>
          <AppText variant="cardTitle">{label}</AppText>
          <AppText variant="body" dim>
            {rarity}
          </AppText>
        </Card>
        <Card style={{ flex: 1, gap: 4 }}>
          <AppText variant="microLabel" dim>
            POINTS EARNED
          </AppText>
          <AppText variant="pointsInline" color={tokens.fuchsia} style={{ fontSize: 22 }}>
            +{points}
          </AppText>
        </Card>
      </View>

      <View style={{ flex: 1 }} />

      <Button label="Share this tree" loading={submitting} onPress={submit} />
      <AppText variant="body" dim style={{ textAlign: 'center' }}>
        Points land as pending until 2 foragers confirm on site
      </AppText>
    </View>
  );
}
