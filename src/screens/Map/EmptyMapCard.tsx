import { View } from 'react-native';

import { spacing } from '@/theme/spacing';
import { AppText, Button, Card, Kicker } from '@/components/ui';

type EmptyMapCardProps =
  | { variant: 'nothing_mapped'; onAddFirst: () => void }
  | { variant: 'filtered_empty'; onLoosen: () => void };

/** Two distinct empty states — never conflate them: an area with zero trees needs "be the
 * first", a filtered-out area needs "loosen your filters". */
export function EmptyMapCard(props: EmptyMapCardProps) {
  return (
    <View style={{ paddingHorizontal: spacing.screenH }}>
      <Card style={{ gap: 10 }}>
        {props.variant === 'nothing_mapped' ? (
          <>
            <Kicker>Nothing mapped here yet</Kicker>
            <AppText variant="cardTitle">Be the first on this street</AppText>
            <AppText variant="body" dim>
              The first pin on a block is always the hardest. Every tree you log helps the next
              forager find lunch.
            </AppText>
            <Button label="Add the first tree" onPress={props.onAddFirst} />
          </>
        ) : (
          <>
            <AppText variant="cardTitle">Nothing matches these filters</AppText>
            <Button label="Loosen them" variant="ghost" onPress={props.onLoosen} />
          </>
        )}
      </Card>
    </View>
  );
}
