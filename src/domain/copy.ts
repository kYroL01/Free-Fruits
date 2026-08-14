import type { ConditionReason } from './types';

/** Short, all-caps condition labels for tree cards/detail — colour follows kind (good=green,
 * bad=gold), and the label is always shown as text too, never colour alone. */
export const CONDITION_SHORT_LABEL: Record<ConditionReason, string> = {
  fruit_ready: 'FRUITING',
  fruit_ripening: 'RIPENING',
  season_over: 'SEASON OVER',
  disease_pest: 'PEST',
  dry: 'DRY',
  burnt: 'BURNT',
  removed: 'REMOVED',
  fenced_off: 'FENCED',
};

export const CONDITION_LABEL: Record<ConditionReason, string> = {
  fruit_ready: 'Fruit ready to pick',
  fruit_ripening: 'Fruit still ripening',
  season_over: 'Season over',
  disease_pest: 'Disease or pest',
  dry: 'Dry',
  burnt: 'Burnt',
  removed: 'Cut back or removed',
  fenced_off: 'Fenced off',
};

const GOOD_REASONS = new Set(['fruit_ready', 'fruit_ripening', 'season_over']);

export function isGoodReason(reason: ConditionReason): boolean {
  return GOOD_REASONS.has(reason);
}
