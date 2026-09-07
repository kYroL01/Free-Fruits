import type { ConditionReason } from './types';
import { t } from '@/i18n';

/** Short, all-caps condition labels for tree cards/detail — colour follows kind (good=green,
 * bad=gold), and the label is always shown as text too, never colour alone. */
/** Short, all-caps condition labels for tree cards/detail — colour follows kind (good=green,
 * bad=gold), and the label is always shown as text too, never colour alone. Uppercasing is done
 * by the type scale, so the catalogue holds sentence case. */
const SHORT_LABEL_KEY: Record<ConditionReason, string> = {
  fruit_ready: 'condition.shortFruitReady',
  fruit_ripening: 'condition.shortFruitRipening',
  season_over: 'condition.shortSeasonOver',
  disease_pest: 'condition.shortDiseasePest',
  dry: 'condition.shortDry',
  burnt: 'condition.shortBurnt',
  removed: 'condition.shortRemoved',
  fenced_off: 'condition.shortFencedOff',
};

const LABEL_KEY: Record<ConditionReason, string> = {
  fruit_ready: 'condition.fruitReady',
  fruit_ripening: 'condition.fruitRipening',
  season_over: 'condition.seasonOver',
  disease_pest: 'condition.diseasePest',
  dry: 'condition.dry',
  burnt: 'condition.burnt',
  removed: 'condition.removed',
  fenced_off: 'condition.fencedOff',
};

export function conditionShortLabel(reason: ConditionReason): string {
  return t(SHORT_LABEL_KEY[reason]);
}

export function conditionLabel(reason: ConditionReason): string {
  return t(LABEL_KEY[reason]);
}

const GOOD_REASONS = new Set(['fruit_ready', 'fruit_ripening', 'season_over']);

export function isGoodReason(reason: ConditionReason): boolean {
  return GOOD_REASONS.has(reason);
}
