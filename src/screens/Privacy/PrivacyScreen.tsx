import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { useAppStore } from '@/store';
import type { Precision } from '@/store/slices/settingsSlice';
import { AppText, Card, Kicker, RadioRow, Switch } from '@/components/ui';
import { t } from '@/i18n';

const PRECISION_LABEL: Record<Precision, string> = {
  exact: 'privacy.precisionExact',
  blur: 'privacy.precisionBlur',
  private: 'privacy.precisionPrivate',
};

export function PrivacyScreen() {
  const { tokens } = useTheme();
  const router = useRouter();

  const precision = useAppStore((s) => s.precision);
  const setPrecision = useAppStore((s) => s.setPrecision);
  const trailOptIn = useAppStore((s) => s.trailOptIn);
  const setTrailOptIn = useAppStore((s) => s.setTrailOptIn);
  const harvestOptIn = useAppStore((s) => s.harvestOptIn);
  const setHarvestOptIn = useAppStore((s) => s.setHarvestOptIn);

  const [wipeArmed, setWipeArmed] = useState(false);
  const [wiped, setWiped] = useState(false);
  const [exported, setExported] = useState(false);

  const onWipe = () => {
    if (!wipeArmed) {
      setWipeArmed(true);
      return;
    }
    setWiped(true);
    setWipeArmed(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      contentContainerStyle={{ padding: spacing.screenH, paddingTop: spacing.screenTop, gap: 20 }}
    >
      <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} hitSlop={10} onPress={() => router.back()}>
        <AppText variant="cardTitle">‹</AppText>
      </Pressable>

      <AppText variant="screenTitle">{t('privacy.title')}</AppText>
      <AppText variant="body" dim>
        A foraging map only works if the trees are real, so photos carry GPS. Everything about
        you is a choice.
      </AppText>

      <View style={{ gap: 10 }}>
        <Kicker>{t('privacy.whatWeStore')}</Kicker>
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText variant="rowLabel">{t('privacy.gpsInPhotosTitle')}</AppText>
            <AppText variant="microLabel" color={tokens.green}>
              {t('privacy.kept')}
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText variant="rowLabel">{t('privacy.pinsYouOpened')}</AppText>
            <AppText variant="microLabel" dim>
              30 DAYS
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText variant="rowLabel">{t('privacy.yourLivePosition')}</AppText>
            <AppText variant="microLabel" color={tokens.green}>
              {t('privacy.neverStored')}
            </AppText>
          </View>
        </Card>
      </View>

      <View style={{ gap: 4 }}>
        <Kicker>{t('privacy.myTreesOnPublicMap')}</Kicker>
        {(['exact', 'blur', 'private'] as Precision[]).map((p) => (
          <RadioRow key={p} label={PRECISION_LABEL[p]} selected={precision === p} onPress={() => setPrecision(p)} />
        ))}
      </View>

      <View style={{ gap: 14 }}>
        <Kicker>{t('privacy.tracking')}</Kicker>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="rowLabel" style={{ flex: 1 }}>
            {t('privacy.keepTrail')}
          </AppText>
          <Switch value={trailOptIn} onValueChange={setTrailOptIn} accessibilityLabel={t('privacy.keepTrail')} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="rowLabel" style={{ flex: 1 }}>
            {t('privacy.shareHarvestCounts')}
          </AppText>
          <Switch
            value={harvestOptIn}
            onValueChange={setHarvestOptIn}
            accessibilityLabel={t('privacy.shareHarvestCounts')}
          />
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Kicker>{t('privacy.locationHistory', { points: 148, days: 62 })}</Kicker>
        <AppText variant="body" dim>
          Your trail is used only to compute distances and unlock nearby check-ins. Wiping it
          keeps your logged trees — it removes only the trail.
        </AppText>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            accessibilityRole="button"
            onPress={onWipe}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: tokens.line, alignItems: 'center' }}
          >
            <AppText variant="rowLabel" color={wiped ? tokens.green : tokens.text}>
              {wiped
                ? t('privacy.historyWiped')
                : wipeArmed
                  ? t('privacy.tapAgainToConfirm')
                  : t('privacy.wipeHistory')}
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setExported(true)}
            style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: tokens.line, alignItems: 'center' }}
          >
            <AppText variant="rowLabel">{exported ? t('common.sent') : t('privacy.export')}</AppText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
