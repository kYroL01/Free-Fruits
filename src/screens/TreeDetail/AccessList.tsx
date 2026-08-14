import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { AppText, Kicker, StatusDot } from '@/components/ui';

/** Access facts aren't part of the seed data schema — this is a reasonable placeholder template
 * derived from the tree's fence flag, not a per-tree survey. */
export function AccessList({ fence }: { fence: boolean }) {
  const { tokens } = useTheme();

  const facts = fence
    ? [
        { color: tokens.gold, text: 'Fenced off — may need permission or a reach-through' },
        { color: tokens.green, text: 'Public pavement leads right up to it' },
        { color: tokens.gold, text: 'Busy road nearby — mind the traffic side' },
      ]
    : [
        { color: tokens.green, text: 'Public pavement — no fence, no permission needed' },
        { color: tokens.green, text: 'Step-free access from the street' },
        { color: tokens.gold, text: 'Busy road nearby — mind the traffic side' },
      ];

  return (
    <View style={{ gap: 10 }}>
      <Kicker>Access</Kicker>
      {facts.map((fact, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <StatusDot color={fact.color} />
          <AppText variant="rowLabel" style={{ flex: 1 }}>
            {fact.text}
          </AppText>
        </View>
      ))}
    </View>
  );
}
