import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { AppText, Kicker, SegmentedProgress } from '@/components/ui';
import type { Tree } from '@/domain/types';
import { t } from '@/i18n';

export function VerificationBlock({ tree }: { tree: Tree }) {
  const { tokens } = useTheme();
  const remaining = Math.max(0, tree.confirmationsNeeded - tree.confirmations);
  const filled = Math.round((tree.confirmations / tree.confirmationsNeeded) * 4);

  return (
    <View
      style={{
        backgroundColor: tree.pending ? tokens.fuchsiaSoft : tokens.greenSoft,
        borderRadius: radii.card,
        padding: 16,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Kicker color={tree.pending ? tokens.fuchsia : tokens.green}>
          {tree.pending
            ? t('treeDetail.needsMoreChecks', { count: remaining })
            : t('treeDetail.verifiedByCommunity')}
        </Kicker>
        <AppText variant="microLabel" dim>
          {tree.pending
            ? t('treeDetail.confirmationsNeeded', {
                have: tree.confirmations,
                need: tree.confirmationsNeeded,
              })
            : t('treeDetail.onSiteOks', { count: tree.confirmations })}
        </AppText>
      </View>

      <SegmentedProgress
        segments={4}
        filled={filled}
        color={tree.pending ? tokens.fuchsia : tokens.green}
      />

      <AppText variant="body" dim>
        {t('treeDetail.verificationBody')}
      </AppText>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            backgroundColor: tokens.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText variant="microLabel">{tree.finderHandle.charAt(0).toUpperCase()}</AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="microLabel" dim>
            {t('treeDetail.discoveredBy')}
          </AppText>
          <AppText variant="rowLabel">
            {tree.finderHandle} · {new Date(tree.createdAt).toLocaleDateString()}
          </AppText>
        </View>
        <AppText variant="microLabel" dim>
          {t('treeDetail.permanentCredit')}
        </AppText>
      </View>
    </View>
  );
}
