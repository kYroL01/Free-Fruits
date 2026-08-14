import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { AppText, BarProgress, Button, Card } from '@/components/ui';
import type { Reward } from './rewards';

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
    ? 'Locked'
    : redeemed
      ? 'Redeemed'
      : canAfford
        ? `Redeem · ${reward.cost}`
        : `Need ${reward.cost - points} more`;

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
