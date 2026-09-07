import { View } from 'react-native';

import { spacing } from '@/theme/spacing';
import { AppText, Button, Card, Kicker } from '@/components/ui';
import { t } from '@/i18n';

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
            <Kicker>{t('map.nothingMappedTitle')}</Kicker>
            <AppText variant="cardTitle">{t('map.nothingMappedBody')}</AppText>
            <AppText variant="body" dim>
              The first pin on a block is always the hardest. Every tree you log helps the next
              forager find lunch.
            </AppText>
            <Button label={t('map.addFirstTree')} onPress={props.onAddFirst} />
          </>
        ) : (
          <>
            <AppText variant="cardTitle">{t('map.nothingMatchesFilters')}</AppText>
            <Button label={t('map.loosenThem')} variant="ghost" onPress={props.onLoosen} />
          </>
        )}
      </Card>
    </View>
  );
}
