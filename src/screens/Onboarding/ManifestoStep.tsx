import { View } from 'react-native';

import { spacing } from '@/theme/spacing';
import { CITY_LABEL } from '@/domain/constants';
import { t } from '@/i18n';
import { AppText, Button, Kicker } from '@/components/ui';

const RULES = [
  { index: '01', title: t('onboarding.rule1Title'), body: t('onboarding.rule1Body') },
  { index: '02', title: t('onboarding.rule2Title'), body: t('onboarding.rule2Body') },
  { index: '03', title: t('onboarding.rule3Title'), body: t('onboarding.rule3Body') },
];

type ManifestoStepProps = {
  onStart: () => void;
  onAlreadyHaveAccount: () => void;
};

export function ManifestoStep({ onStart, onAlreadyHaveAccount }: ManifestoStepProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#D4148B',
        justifyContent: 'flex-end',
        padding: spacing.screenH,
        paddingBottom: 48,
        gap: 18,
      }}
    >
      <Kicker color="#FFFFFF">{t('onboarding.kicker', { city: CITY_LABEL })}</Kicker>
      <AppText variant="successHeadline" color="#FFFFFF">
        {t('onboarding.headline')}
      </AppText>
      <AppText variant="body" color="rgba(255,255,255,0.85)">
        {t('onboarding.intro')}
      </AppText>

      <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />

      <View style={{ gap: 16 }}>
        {RULES.map((rule) => (
          <View key={rule.index} style={{ flexDirection: 'row', gap: 12 }}>
            <AppText variant="pointsInline" color="rgba(255,255,255,0.6)">
              {rule.index}
            </AppText>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="cardTitle" color="#FFFFFF" style={{ fontSize: 14 }}>
                {rule.title}
              </AppText>
              <AppText variant="body" color="rgba(255,255,255,0.75)">
                {rule.body}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <Button label={t('onboarding.startForaging')} variant="onFuchsia" onPress={onStart} />
      <AppText
        variant="microLabel"
        color="rgba(255,255,255,0.7)"
        style={{ textAlign: 'center' }}
        onPress={onAlreadyHaveAccount}
      >
        {t('onboarding.alreadyHaveAccount')}
      </AppText>
    </View>
  );
}
