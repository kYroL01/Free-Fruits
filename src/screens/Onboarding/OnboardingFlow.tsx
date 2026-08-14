import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useCameraPermissions } from 'expo-camera';
import * as Notifications from 'expo-notifications';

import { useAppStore } from '@/store';
import { t } from '@/i18n';
import { ManifestoStep } from './ManifestoStep';
import { PermissionStep, type PermissionStepConfig } from './PermissionStep';
import { RefusalStep } from './RefusalStep';

type Step = 'manifesto' | 'location' | 'refusal' | 'camera' | 'notifications';

// Titles/bodies/CTAs/skip labels are wired through i18n; the fact rows and footnotes are not yet
// extracted (see src/i18n/index.ts doc comment — infra + high-traffic strings only, not a full pass).
const LOCATION_CONFIG: PermissionStepConfig = {
  label: 'GPS',
  tint: '#FCE3F1',
  title: t('onboarding.locationTitle'),
  body: t('onboarding.locationBody'),
  facts: [
    { title: 'Only while the app is open', body: 'We never track you in the background.' },
    { title: 'Your live position is never stored', body: 'Only the trees you log or confirm are.' },
    { title: 'You can turn it off any time', body: 'The map still works — you just cannot log or check in.' },
  ],
  ctaLabel: t('onboarding.allowLocation'),
  skipLabel: t('onboarding.notNow'),
  footnote: "This is what the OS dialog will ask — we won't ask again if you say no.",
};

const CAMERA_CONFIG: PermissionStepConfig = {
  label: 'CAM',
  tint: '#E2F1E6',
  title: t('onboarding.cameraTitle'),
  body: t('onboarding.cameraBody'),
  facts: [
    { title: 'Live capture only', body: 'Library uploads cannot prove a location.' },
    { title: 'Photos are yours', body: 'Only the tree pin and status are shared with the community.' },
    { title: 'You can still browse without it', body: 'You just cannot log new trees.' },
  ],
  ctaLabel: t('onboarding.allowCamera'),
  skipLabel: t('onboarding.later'),
  footnote: 'A device with a camera is required to log a new tree.',
};

const NOTIFICATIONS_CONFIG: PermissionStepConfig = {
  label: 'PING',
  tint: '#F7EBCF',
  title: t('onboarding.notificationsTitle'),
  body: t('onboarding.notificationsBody'),
  facts: [
    { title: 'Never spammy', body: 'Only nearby, actionable trees trigger an alert.' },
    { title: 'Your own trees included', body: "We'll tell you when yours gets verified." },
    { title: 'Change your mind later', body: 'Turn it off any time from Settings.' },
  ],
  ctaLabel: t('onboarding.turnOnAlerts'),
  skipLabel: t('onboarding.noAlertsThanks'),
  footnote: 'You can always change this later in your device Settings.',
};

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('manifesto');
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setPermission = useAppStore((s) => s.setPermission);
  const [, requestCameraPermission] = useCameraPermissions();

  const finish = () => {
    completeOnboarding();
    router.replace('/map');
  };

  const onLocationAllow = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === 'granted';
    setPermission('location', granted ? 'granted' : 'denied');
    setStep(granted ? 'camera' : 'refusal');
  };

  const onCameraAllow = async () => {
    const result = await requestCameraPermission();
    setPermission('camera', result.granted ? 'granted' : 'denied');
    setStep('notifications'); // deny/allow both advance silently
  };

  const onNotificationsAllow = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermission('notifications', status === 'granted' ? 'granted' : 'denied');
    finish();
  };

  switch (step) {
    case 'manifesto':
      return <ManifestoStep onStart={() => setStep('location')} onAlreadyHaveAccount={finish} />;
    case 'location':
      return (
        <PermissionStep
          {...LOCATION_CONFIG}
          stepIndex={0}
          onAllow={onLocationAllow}
          onSkip={() => setStep('camera')}
        />
      );
    case 'refusal':
      return <RefusalStep onBrowseWithoutIt={finish} />;
    case 'camera':
      return (
        <PermissionStep
          {...CAMERA_CONFIG}
          stepIndex={1}
          onAllow={onCameraAllow}
          onSkip={() => setStep('notifications')}
        />
      );
    case 'notifications':
      return (
        <PermissionStep
          {...NOTIFICATIONS_CONFIG}
          stepIndex={2}
          onAllow={onNotificationsAllow}
          onSkip={finish}
        />
      );
  }
}
