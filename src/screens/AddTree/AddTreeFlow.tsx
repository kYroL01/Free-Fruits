import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { spacing } from '@/theme/spacing';
import type { LatLng, Species } from '@/domain/types';
import { AppText, SegmentedProgress } from '@/components/ui';
import { CameraStep } from './steps/CameraStep';
import { SpeciesStep, type SpeciesPick } from './steps/SpeciesStep';
import { PinStep } from './steps/PinStep';

type Draft = {
  photoUri: string | null;
  exifGps: LatLng | null;
  takenAt: string | null;
  speciesPick: SpeciesPick | null;
};

const STEP_TITLES = ['Prove it on site', "What's growing here?", 'Where exactly?'];

export function AddTreeFlow() {
  const { tokens } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const openModal = useAppStore((s) => s.openModal);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<Draft>({
    photoUri: null,
    exifGps: null,
    takenAt: null,
    speciesPick: null,
  });

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg, paddingTop: insets.top + 12 }}>
      <View style={{ paddingHorizontal: spacing.screenH, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={10} onPress={() => router.back()}>
            <AppText variant="cardTitle">×</AppText>
          </Pressable>
          <AppText variant="microLabel" dim>
            STEP {step} OF 3
          </AppText>
        </View>
        <AppText variant="sheetTitle">{STEP_TITLES[step - 1]}</AppText>
        <SegmentedProgress segments={3} filled={step} />
      </View>

      <View style={{ flex: 1, padding: spacing.screenH }}>
        {step === 1 && (
          <CameraStep
            onCaptured={({ photoUri, exifGps, takenAt }) => {
              setDraft((d) => ({ ...d, photoUri, exifGps, takenAt }));
              setStep(2);
            }}
            onNoLocationUpload={() => openModal({ type: 'no_location' })}
          />
        )}

        {step === 2 && draft.photoUri && draft.exifGps && (
          <SpeciesStep
            photoUri={draft.photoUri}
            location={draft.exifGps}
            onConfirm={(pick) => {
              setDraft((d) => ({ ...d, speciesPick: pick }));
              setStep(3);
            }}
          />
        )}

        {step === 3 && draft.photoUri && draft.exifGps && draft.takenAt && draft.speciesPick && (
          <PinStep
            photoUri={draft.photoUri}
            exifGps={draft.exifGps}
            takenAt={draft.takenAt}
            species={draft.speciesPick.species as Species | null}
            unlistedName={draft.speciesPick.unlistedName}
            onDone={() => router.back()}
          />
        )}
      </View>
    </View>
  );
}
