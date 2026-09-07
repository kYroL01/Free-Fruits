import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { rarityColor } from '@/theme/tokens';
import { spacing } from '@/theme/spacing';
import { useAppStore } from '@/store';
import { useLocation } from '@/hooks/useLocation';
import { canCheckIn, checkinDecisionCopy, distanceMeters, isWithinCheckinRadius } from '@/domain/rules';
import { findSpecies } from '@/server/seedData/species';
import { flagTree as mockFlagTree } from '@/server/mockServer';
import { formatDistance } from '@/utils/formatDistance';
import { AppText, Button, HatchedPlaceholder } from '@/components/ui';
import { VerificationBlock } from './VerificationBlock';
import { ConditionCard } from './ConditionCard';
import { SeasonStrip } from './SeasonStrip';
import { AccessList } from './AccessList';
import { t } from '@/i18n';

const PHOTO_HEIGHT = 300;
const WALK_SPEED_M_PER_MIN = 80;

export function TreeDetailScreen({ id, openReport }: { id: string; openReport?: boolean }) {
  const router = useRouter();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const tree = useAppStore((s) => s.trees[id]);
  const userId = useAppStore((s) => s.userId);
  const permissions = useAppStore((s) => s.permissions);
  const myReports = useAppStore((s) => s.myReports);
  const openModal = useAppStore((s) => s.openModal);
  const { coords } = useLocation();

  const [walking, setWalking] = useState(false);
  const [flagState, setFlagState] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (openReport && tree) {
      openModal({ type: 'condition_report', treeId: tree.id });
    }
    // Only fire once on mount for the deep-linked "Yes, it's there" flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!tree) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="body" dim>
          {t('treeDetail.notFound')}
        </AppText>
      </View>
    );
  }

  const species = findSpecies(tree.speciesId);
  const speciesName = species?.name ?? t('addTree.unlistedTree');
  const distanceM = coords ? distanceMeters(coords, tree.location) : null;
  const isOwnTree = tree.finderId === userId;

  const checkinDecision = canCheckIn({
    isOwnTree,
    withinCheckinRadius: !!coords && isWithinCheckinRadius(coords, tree.location),
    myLastReportAt: myReports[tree.id]?.at ?? null,
    seasonWindow: species?.seasonWindow ?? [0, 11],
    locationPermission: permissions.location,
    now: new Date(),
  });

  const walkingMinutes = distanceM ? Math.max(1, Math.round(distanceM / WALK_SPEED_M_PER_MIN)) : null;

  const onFlag = async () => {
    setFlagState('sending');
    await mockFlagTree(tree.id, 'not_real_tree');
    setFlagState('sent');
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView bounces={false}>
        <View>
          <HatchedPlaceholder width="100%" height={PHOTO_HEIGHT} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            onPress={() => router.back()}
            hitSlop={6}
            style={{
              position: 'absolute',
              top: insets.top + 20,
              left: spacing.screenH,
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: tokens.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="cardTitle">‹</AppText>
          </Pressable>
          <View
            style={{
              position: 'absolute',
              top: insets.top + 20,
              right: spacing.screenH,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: rarityColor(tokens, tree.rarity),
            }}
          >
            <AppText variant="microLabel" color="#FFFFFF">
              {tree.rarity}
            </AppText>
          </View>
        </View>

        <View style={{ padding: spacing.screenH, gap: 18 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="detailTitle">{speciesName}</AppText>
              <AppText variant="body" dim>
                {tree.street}
                {distanceM !== null ? ` · ${t('treeDetail.distanceAway', { distance: formatDistance(distanceM) })}` : ''}
              </AppText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <AppText variant="pointsInline" color={tokens.fuchsia} style={{ fontSize: 22 }}>
                +{tree.points}
              </AppText>
              <AppText variant="microLabel" dim>
                {t('treeDetail.strawberryPts')}
              </AppText>
            </View>
          </View>

          <VerificationBlock tree={tree} />
          <ConditionCard report={tree.latestReport} />
          <SeasonStrip seasonWindow={species?.seasonWindow ?? [0, 11]} />
          <AccessList fence={tree.fence} />

          <View style={{ gap: 8 }}>
            <Button
              label={checkinDecisionCopy(checkinDecision)}
              disabled={!checkinDecision.allowed}
              onPress={() => openModal({ type: 'condition_report', treeId: tree.id })}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Button
                  label={
                    walking && walkingMinutes && distanceM
                      ? t('treeDetail.walking', {
                          minutes: walkingMinutes,
                          distance: formatDistance(distanceM),
                        })
                      : t('treeDetail.walkMeThere')
                  }
                  variant="dark"
                  onPress={() => setWalking(true)}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('treeDetail.flagThisTree')}
                onPress={onFlag}
                disabled={flagState !== 'idle'}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: tokens.line,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AppText variant="microLabel" dim>
                  {flagState === 'sent' ? t('common.sent') : t('treeDetail.flag')}
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
