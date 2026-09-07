import { ScrollView, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { useAppStore } from '@/store';
import { tierProgress } from '@/domain/rules';
import { redeemReward } from '@/server/mockServer';
import { AppText, BarProgress, Card, Kicker } from '@/components/ui';
import { RewardCard } from './RewardCard';
import { TiersRow } from './TiersRow';
import { REWARDS } from './rewards';
import { t } from '@/i18n';

const TIER_LABEL_KEY: Record<string, string> = {
  sprout: 'points.tierSprout',
  picker: 'points.tierPicker',
  forager: 'points.tierForager',
  orchardist: 'points.tierOrchardist',
};

export function PointsScreen() {
  const { tokens } = useTheme();
  const points = useAppStore((s) => s.points);
  const treeCount = useAppStore((s) => s.treeCount);
  const redeemedRewards = useAppStore((s) => s.redeemedRewards);
  const addPoints = useAppStore((s) => s.addPoints);
  const markRewardRedeemed = useAppStore((s) => s.markRewardRedeemed);

  const progress = tierProgress(points);

  const onRedeem = async (rewardId: string, cost: number) => {
    const result = await redeemReward(cost, points);
    if (!result.ok) return;
    addPoints(-cost);
    markRewardRedeemed(rewardId);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      contentContainerStyle={{ padding: spacing.screenH, paddingTop: spacing.screenTop, gap: 20 }}
    >
      <AppText variant="screenTitle">{t('points.title')}</AppText>

      <Card tint="#10160F" style={{ gap: 12 }}>
        <AppText variant="pointsBig" color="#FFFFFF">
          {points.toLocaleString()}
        </AppText>
        <AppText variant="microLabel" color="rgba(255,255,255,0.7)">
          {t('points.earnedTrees', { count: treeCount })}
        </AppText>
        <BarProgress
          progress={progress.progress}
          trackColor="rgba(255,255,255,0.15)"
          gradientColors={[tokens.green, tokens.fuchsia]}
        />
        <AppText variant="body" color="rgba(255,255,255,0.7)">
          {progress.nextTier
            ? t('points.pointsToNext', {
                count: progress.pointsToNext,
                tier: t(TIER_LABEL_KEY[progress.nextTier]),
              })
            : t('points.topTierReached')}
        </AppText>
      </Card>

      <View style={{ gap: 12 }}>
        <Kicker>{t('points.spendThem')}</Kicker>
        {REWARDS.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            points={points}
            redeemed={redeemedRewards.includes(reward.id)}
            onRedeem={() => onRedeem(reward.id, reward.cost)}
          />
        ))}
      </View>

      <View style={{ gap: 12 }}>
        <Kicker>{t('points.tiers')}</Kicker>
        <TiersRow currentTier={progress.tier} />
      </View>
    </ScrollView>
  );
}
