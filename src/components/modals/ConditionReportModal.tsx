import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { t } from '@/i18n';
import { useLocation } from '@/hooks/useLocation';
import { checkIn } from '@/server/mockServer';
import { canCheckIn, isWithinCheckinRadius } from '@/domain/rules';
import { conditionLabel } from '@/domain/copy';
import { findSpecies } from '@/server/seedData/species';
import type { ConditionKind, ConditionReason } from '@/domain/types';
import { AppText, Button, Card, Kicker, RadioRow } from '@/components/ui';

const GOOD_REASONS: ConditionReason[] = ['fruit_ready', 'fruit_ripening', 'season_over'];
const BAD_REASONS: ConditionReason[] = ['disease_pest', 'dry', 'burnt', 'removed', 'fenced_off'];

export function ConditionReportModal({ treeId }: { treeId: string }) {
  const { tokens } = useTheme();
  const closeModal = useAppStore((s) => s.closeModal);
  const tree = useAppStore((s) => s.trees[treeId]);
  const patchTree = useAppStore((s) => s.patchTree);
  const myReports = useAppStore((s) => s.myReports);
  const recordReport = useAppStore((s) => s.recordReport);
  const addPoints = useAppStore((s) => s.addPoints);
  const permissions = useAppStore((s) => s.permissions);
  const userId = useAppStore((s) => s.userId);
  const { coords, accuracyM } = useLocation();

  const [step, setStep] = useState<1 | 2>(1);
  const [kind, setKind] = useState<ConditionKind | null>(null);
  const [reason, setReason] = useState<ConditionReason | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!tree) return null;

  const species = findSpecies(tree.speciesId);
  const seasonWindow: [number, number] = species?.seasonWindow ?? [0, 11];
  const isFirstCheckinForUser = !myReports[treeId];
  const points = isFirstCheckinForUser ? 5 : 3;

  const submit = async () => {
    if (!reason || !kind) return;
    setSubmitting(true);

    const withinCheckinRadius = !!coords && isWithinCheckinRadius(coords, tree.location);

    const decision = canCheckIn({
      isOwnTree: tree.finderId === userId,
      withinCheckinRadius,
      myLastReportAt: myReports[treeId]?.at ?? null,
      seasonWindow,
      locationPermission: permissions.location,
      now: new Date(),
    });

    if (!decision.allowed) {
      setSubmitting(false);
      closeModal();
      return;
    }

    const result = await checkIn({
      tree,
      kind,
      reason,
      isOwnTree: tree.finderId === userId,
      withinCheckinRadius,
      myLastReportAt: myReports[treeId]?.at ?? null,
      seasonWindow,
      locationPermission: permissions.location,
      isFirstCheckinForUser,
    });

    setSubmitting(false);
    if (!result.allowed) {
      closeModal();
      return;
    }

    const at = new Date().toISOString();
    patchTree(treeId, { latestReport: { kind, reason, at, by: userId } });
    recordReport(treeId, kind, reason, at);
    addPoints(result.points);
    closeModal();
  };

  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Kicker>{t('condition.title')}</Kicker>
        <AppText variant="microLabel" dim>
          {accuracyM ? `GPS ${Math.round(accuracyM)} M` : 'GPS —'}
        </AppText>
      </View>

      {step === 1 ? (
        <>
          <AppText variant="sheetTitle">{t('condition.howIsItNow')}</AppText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: kind === 'good' }}
              onPress={() => {
                setKind('good');
                setReason(null);
                setStep(2);
              }}
              style={{ flex: 1 }}
            >
              <Card tint={tokens.greenSoft} elevated={false} style={{ alignItems: 'center', paddingVertical: 20 }}>
                <AppText variant="cardTitle" color={tokens.green}>
                  {t('common.good')}
                </AppText>
              </Card>
            </Pressable>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: kind === 'bad' }}
              onPress={() => {
                setKind('bad');
                setReason(null);
                setStep(2);
              }}
              style={{ flex: 1 }}
            >
              <Card tint={tokens.goldSoft} elevated={false} style={{ alignItems: 'center', paddingVertical: 20 }}>
                <AppText variant="cardTitle" color={tokens.gold}>
                  {t('common.bad')}
                </AppText>
              </Card>
            </Pressable>
          </View>
          <AppText variant="body" dim>
            Either answer is worth the same points — a dying tree is as useful to know about as
            a full one.
          </AppText>
        </>
      ) : (
        <>
          <AppText variant="sheetTitle">{t('condition.tellUsMore')}</AppText>
          <View>
            {(kind === 'good' ? GOOD_REASONS : BAD_REASONS).map((r) => (
              <RadioRow
                key={r}
                label={conditionLabel(r)}
                selected={reason === r}
                onPress={() => setReason(r)}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button label={t('common.back')} variant="ghost" onPress={() => setStep(1)} />
            </View>
            <View style={{ flex: 2 }}>
              <Button
                label={`Submit report · +${points}`}
                disabled={!reason}
                loading={submitting}
                onPress={submit}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}
