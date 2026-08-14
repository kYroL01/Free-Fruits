import { STRIKE_PENALTY_POINTS } from './points';

export const STRIKES_BEFORE_PENALTY = 3;

export type StrikeResult = { newStrikeCount: number; pointsPenalty: number };

/** A rejected duplicate claim costs nothing on its own. The 3rd rejected claim costs 5 points,
 * and the counter resets to 0 (assumption: not specified in the source spec). */
export function applyStrike(currentStrikes: number): StrikeResult {
  const next = currentStrikes + 1;
  if (next >= STRIKES_BEFORE_PENALTY) {
    return { newStrikeCount: 0, pointsPenalty: STRIKE_PENALTY_POINTS };
  }
  return { newStrikeCount: next, pointsPenalty: 0 };
}
