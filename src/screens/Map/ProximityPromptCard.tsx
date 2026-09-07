import { View } from 'react-native';

import { radii } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { AppText, Button, Kicker } from '@/components/ui';
import { t } from '@/i18n';

type ProximityPromptCardProps = {
  distanceM: number;
  speciesName: string;
  onConfirm: () => void;
  onDismiss: () => void;
};

/** Shown when the user is within ~12m of an unverified pin. */
export function ProximityPromptCard({ distanceM, speciesName, onConfirm, onDismiss }: ProximityPromptCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#D4148B',
          borderRadius: radii.card,
          padding: 16,
          gap: 12,
        },
        shadows.proximityCard,
      ]}
    >
      <Kicker color="#FFFFFF">{`You're ${Math.round(distanceM)} m away`}</Kicker>
      <AppText variant="cardTitle" color="#FFFFFF">
        Someone logged a {speciesName.toLowerCase()} here. Is it real?
      </AppText>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Button label={t('map.proximityYes')} variant="onFuchsia" onPress={onConfirm} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label={t('map.proximityNo')} variant="ghostOnFuchsia" onPress={onDismiss} />
        </View>
      </View>
    </View>
  );
}
