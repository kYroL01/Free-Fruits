import { FlatList, Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import type { Tree } from '@/domain/types';
import { AppText } from '@/components/ui';
import { TreeCard } from './TreeCard';

const CARD_WIDTH = 212;
const GAP = 12;

type ResultsCarouselProps = {
  trees: Tree[];
  radiusLabel: string;
  speciesName: (speciesId: string) => string;
  distanceLabel: (tree: Tree) => string;
  onSeeAll: () => void;
  onTreePress: (id: string) => void;
};

export function ResultsCarousel({
  trees,
  radiusLabel,
  speciesName,
  distanceLabel,
  onSeeAll,
  onTreePress,
}: ResultsCarouselProps) {
  const { tokens } = useTheme();

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.screenH,
        }}
      >
        <AppText variant="rowTitle">
          {trees.length} tree{trees.length === 1 ? '' : 's'} within {radiusLabel}
        </AppText>
        <Pressable accessibilityRole="button" onPress={onSeeAll} hitSlop={8}>
          <AppText variant="microLabel" color={tokens.fuchsia}>
            SEE ALL
          </AppText>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={trees}
        keyExtractor={(t) => t.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + GAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, gap: GAP }}
        renderItem={({ item }) => (
          <TreeCard
            tree={item}
            speciesName={speciesName(item.speciesId)}
            distanceLabel={distanceLabel(item)}
            onPress={() => onTreePress(item.id)}
          />
        )}
      />
    </View>
  );
}
