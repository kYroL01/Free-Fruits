import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { AppText, BarProgress, Button, Card } from '@/components/ui';
import type { Reward } from './rewards';
import { t } from '@/i18n';

type RewardCardProps = {
  reward: Reward;
  points: number;
  redeemed: boolean;
  onRedeem: () => void;
};

export function RewardCard({ reward, points, redeemed, onRedeem }: RewardCardProps) {
  const { tokens } = useTheme();
  const progress = Math.min(1, points / reward.cost);
  const canAfford = points >= reward.cost;

  const ctaLabel = reward.locked
    ? t('points.rewardLocked')
    : redeemed
      ? t('points.rewardRedeemed')
      : canAfford
        ? t('points.rewardRedeem', { cost: reward.cost })
        : t('points.rewardNeedMore', { count: reward.cost - points });

  return (
    <Card style={{ gap: 10 }}>
      <AppText variant="cardTitle">{reward.title}</AppText>
      <AppText variant="body" dim>
        {reward.body}
      </AppText>
      <BarProgress progress={reward.locked ? 0 : progress} fillColor={tokens.fuchsia} />
      <Button
        label={ctaLabel}
        variant="ghost"
        disabled={reward.locked || redeemed || !canAfford}
        onPress={onRedeem}
      />
    </Card>
  );
}
