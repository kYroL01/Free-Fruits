import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { rarityColor } from '@/theme/tokens';
import { radii } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { CONDITION_SHORT_LABEL, isGoodReason } from '@/domain/copy';
import type { Tree } from '@/domain/types';
import { AppText, HatchedPlaceholder, StatusDot } from '@/components/ui';

const CARD_WIDTH = 212;

type TreeCardProps = {
  tree: Tree;
  speciesName: string;
  distanceLabel: string;
  onPress: () => void;
};

export function TreeCard({ tree, speciesName, distanceLabel, onPress }: TreeCardProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${speciesName}, ${distanceLabel}, ${tree.pending ? 'pending' : 'verified'}`}
      onPress={onPress}
      style={[
        { width: CARD_WIDTH, borderRadius: radii.card, backgroundColor: tokens.surface, overflow: 'hidden' },
        shadows.card,
      ]}
    >
      <View>
        <HatchedPlaceholder width={CARD_WIDTH} height={84} />
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            paddingHorizontal: 6,
            paddingVertical: 3,
            borderRadius: 8,
            backgroundColor: rarityColor(tokens, tree.rarity),
          }}
        >
          <AppText variant="microLabel" color="#FFFFFF">
            {tree.rarity}
          </AppText>
        </View>
      </View>

      <View style={{ padding: 12, gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <AppText variant="cardTitle" style={{ flex: 1 }}>
            {speciesName}
          </AppText>
          <AppText variant="pointsInline" color={tokens.fuchsia}>
            +{tree.points}
          </AppText>
        </View>

        <AppText variant="body" dim>
          {distanceLabel} · {tree.street}
        </AppText>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingTop: 8,
            marginTop: 2,
            borderTopWidth: 1,
            borderTopColor: tokens.line,
          }}
        >
          <StatusDot color={tree.pending ? tokens.fuchsia : tokens.green} />
          <AppText variant="microLabel" dim>
            {tree.pending ? 'PENDING' : 'VERIFIED'}
          </AppText>
          {tree.latestReport && (
            <AppText variant="microLabel" color={isGoodReason(tree.latestReport.reason) ? tokens.green : tokens.gold}>
              {' '}
              · {CONDITION_SHORT_LABEL[tree.latestReport.reason]}
            </AppText>
          )}
        </View>
      </View>
    </Pressable>
  );
}
