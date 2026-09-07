import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { AppText, Kicker, StatusDot } from '@/components/ui';
import { t } from '@/i18n';

/** Access facts aren't part of the seed data schema — this is a reasonable placeholder template
 * derived from the tree's fence flag, not a per-tree survey. */
export function AccessList({ fence }: { fence: boolean }) {
  const { tokens } = useTheme();

  const facts = fence
    ? [
        { color: tokens.gold, text: t('treeDetail.accessFenced') },
        { color: tokens.green, text: t('treeDetail.accessPavementUpToIt') },
        { color: tokens.gold, text: t('treeDetail.accessBusyRoad') },
      ]
    : [
        { color: tokens.green, text: t('treeDetail.accessPublicPavement') },
        { color: tokens.green, text: t('treeDetail.accessStepFree') },
        { color: tokens.gold, text: t('treeDetail.accessBusyRoad') },
      ];

  return (
    <View style={{ gap: 10 }}>
      <Kicker>{t('treeDetail.access')}</Kicker>
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
