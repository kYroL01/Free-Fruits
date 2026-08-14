import type { Species } from '../types';

export const UNLISTED_SPECIES_POINTS = 15;
export const CONFIRM_SAME_TREE_POINTS = 5;
export const CHECKIN_FIRST_POINTS = 5;
export const CHECKIN_REPEAT_POINTS = 3;
export const INVITE_JOIN_POINTS = 10;
export const STRIKE_PENALTY_POINTS = 5;

/** Unlisted (user-typed) species score 15 as Unrated; a community botanist assigns real rarity later. */
export function computeNewTreePoints(species: Species | null): number {
  return species ? species.points : UNLISTED_SPECIES_POINTS;
}

export function checkinPoints(isFirstCheckinForUser: boolean): number {
  return isFirstCheckinForUser ? CHECKIN_FIRST_POINTS : CHECKIN_REPEAT_POINTS;
}
