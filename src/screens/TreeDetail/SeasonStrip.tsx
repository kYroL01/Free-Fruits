import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { isInSeason } from '@/domain/rules';
import { AppText, Kicker } from '@/components/ui';

export function SeasonStrip({ seasonWindow }: { seasonWindow: [number, number] }) {
  const { tokens } = useTheme();
  const now = new Date();
  const currentMonth = now.getMonth();
  const inSeasonNow = isInSeason(seasonWindow, now);

  return (
    <View style={{ gap: 10 }}>
      <Kicker>Season</Kicker>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {Array.from({ length: 12 }).map((_, month) => {
          const isCurrent = month === currentMonth;
          const inSeason = isInSeason(seasonWindow, new Date(now.getFullYear(), month, 1));
          const color = isCurrent ? tokens.fuchsia : inSeason ? tokens.fuchsiaSoft : tokens.surface2;
          return (
            <View key={month} style={{ flex: 1, height: 26, borderRadius: 5, backgroundColor: color }} />
          );
        })}
      </View>
      {inSeasonNow && (
        <AppText variant="body" color={tokens.green}>
          In season right now
        </AppText>
      )}
    </View>
  );
}
