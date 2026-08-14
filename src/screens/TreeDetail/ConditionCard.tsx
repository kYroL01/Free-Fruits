import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { CONDITION_LABEL, isGoodReason } from '@/domain/copy';
import type { ConditionReport } from '@/domain/types';
import { AppText, IconTile } from '@/components/ui';

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

export function ConditionCard({ report }: { report: ConditionReport | null }) {
  const { tokens } = useTheme();
  if (!report) return null;

  const good = isGoodReason(report.reason);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: tokens.surface,
        borderRadius: 16,
        padding: 14,
      }}
    >
      <IconTile tint={good ? tokens.greenSoft : tokens.goldSoft} size={30}>
        <AppText variant="rowTitle" color={good ? tokens.green : tokens.gold}>
          {good ? 'OK' : '!'}
        </AppText>
      </IconTile>
      <View style={{ flex: 1 }}>
        <AppText variant="microLabel" dim>
          CONDITION · LATEST REPORT
        </AppText>
        <AppText variant="rowLabel">{CONDITION_LABEL[report.reason]}</AppText>
      </View>
      <AppText variant="microLabel" dim>
        {relativeTime(report.at)} · {report.by}
      </AppText>
    </View>
  );
}
