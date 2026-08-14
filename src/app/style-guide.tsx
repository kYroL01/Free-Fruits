import { ScrollView, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import {
  AppText,
  BarProgress,
  Button,
  Card,
  Chip,
  IconTile,
  Kicker,
  Pill,
  RadioRow,
  SegmentedProgress,
  StatusDot,
  Switch,
} from '@/components/ui';
import { rarityColor } from '@/theme/tokens';

/** Dev-only route (not linked from any nav) — visual reference for the token/primitive system.
 * Reachable at /style-guide. */
export default function StyleGuide() {
  const { tokens, dark, toggleTheme } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      contentContainerStyle={{ padding: spacing.screenH, paddingTop: 64, gap: 20 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="screenTitle">Free Fruits</AppText>
        <Pill label={dark ? 'LIGHT' : 'DARK'} onPress={toggleTheme} />
      </View>

      <Kicker>Style guide</Kicker>

      <Card style={{ gap: 8 }}>
        <AppText variant="detailTitle">Fig</AppText>
        <AppText variant="body" dim>
          Via Gola · 120 m away
        </AppText>
        <AppText variant="pointsInline" color={tokens.fuchsia}>
          +30 pts
        </AppText>
      </Card>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {(['common', 'rare', 'legendary', 'unrated'] as const).map((r) => (
          <View key={r} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <StatusDot color={rarityColor(tokens, r)} />
            <AppText variant="rowLabel">{r}</AppText>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Chip label="Fruit trees" active onPress={() => {}} />
        <Chip label="Herbs & greens" active={false} onPress={() => {}} />
      </View>

      <Card style={{ gap: 10 }}>
        <AppText variant="sectionKicker">Verified by community</AppText>
        <SegmentedProgress segments={4} filled={3} color={tokens.green} />
        <AppText variant="body" dim>
          3 / 4 on-site OKs
        </AppText>
      </Card>

      <Card style={{ gap: 10 }}>
        <AppText variant="sectionKicker">Tier progress</AppText>
        <BarProgress progress={0.62} gradientColors={[tokens.green, tokens.fuchsia]} />
        <AppText variant="body" dim>
          760 points to Orchardist
        </AppText>
      </Card>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <IconTile tint={tokens.goldSoft} size={30}>
          <AppText variant="rowTitle" color={tokens.gold}>
            !
          </AppText>
        </IconTile>
        <AppText variant="rowLabel">Dry — needs water</AppText>
      </Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppText variant="rowLabel">Keep a trail of my walks</AppText>
        <Switch value onValueChange={() => {}} accessibilityLabel="Keep a trail of my walks" />
      </View>

      <RadioRow label="Fruit ready to pick" selected onPress={() => {}} />
      <RadioRow label="Fruit still ripening" selected={false} onPress={() => {}} />

      <Button label="Confirm Fig · +30" onPress={() => {}} />
      <Button label="Pick a species first" onPress={() => {}} disabled />
      <Button label="Walk me there" variant="dark" onPress={() => {}} />
      <Button label="Loosen them" variant="ghost" onPress={() => {}} />
    </ScrollView>
  );
}
