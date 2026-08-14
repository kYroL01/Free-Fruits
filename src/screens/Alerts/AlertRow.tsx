import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import type { ColorTokens } from '@/theme/tokens';
import type { Alert, AlertKind } from '@/domain/types';
import { AppText, StatusDot } from '@/components/ui';

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 1) return 'NOW';
  if (hours < 24) return `${hours}H`;
  const days = Math.floor(hours / 24);
  return `${days}D`;
}

function tintFor(tokens: ColorTokens, kind: AlertKind): string | undefined {
  switch (kind) {
    case 'nearby_unverified':
      return tokens.fuchsiaSoft;
    case 'claim_review':
      return tokens.goldSoft;
    case 'reopened_checkin':
      return tokens.greenSoft;
    case 'info':
      return undefined;
  }
}

function dotColorFor(tokens: ColorTokens, kind: AlertKind): string {
  switch (kind) {
    case 'nearby_unverified':
      return tokens.fuchsia;
    case 'claim_review':
      return tokens.gold;
    case 'reopened_checkin':
      return tokens.green;
    case 'info':
      return tokens.dim;
  }
}

export function AlertRow({ alert, onPress }: { alert: Alert; onPress: () => void }) {
  const { tokens } = useTheme();
  const actionable = !!alert.treeId;
  const tint = tintFor(tokens, alert.kind);

  return (
    <Pressable
      accessibilityRole={actionable ? 'button' : undefined}
      disabled={!actionable}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: 10,
        padding: 14,
        borderRadius: radii.card,
        backgroundColor: tint ?? 'transparent',
        opacity: alert.read ? 0.6 : 1,
      }}
    >
      <View style={{ paddingTop: 4 }}>
        <StatusDot color={dotColorFor(tokens, alert.kind)} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="rowTitle">{alert.title}</AppText>
        <AppText variant="body" dim>
          {alert.body}
        </AppText>
      </View>
      <AppText variant="microLabel" dim>
        {relativeTime(alert.at)}
      </AppText>
    </Pressable>
  );
}
