import type { Tier } from '../types';

export const TIER_THRESHOLDS: Record<Tier, number> = {
  sprout: 0,
  picker: 250,
  forager: 1000,
  orchardist: 2000,
};

const TIER_ORDER: Tier[] = ['sprout', 'picker', 'forager', 'orchardist'];

export function computeTier(points: number): Tier {
  let current: Tier = 'sprout';
  for (const tier of TIER_ORDER) {
    if (points >= TIER_THRESHOLDS[tier]) current = tier;
  }
  return current;
}

export type TierProgress = {
  tier: Tier;
  nextTier: Tier | null;
  pointsToNext: number;
  progress: number; // 0..1 between current tier's floor and next tier's floor
};

export function tierProgress(points: number): TierProgress {
  const tier = computeTier(points);
  const idx = TIER_ORDER.indexOf(tier);
  const nextTier = TIER_ORDER[idx + 1] ?? null;

  if (!nextTier) {
    return { tier, nextTier: null, pointsToNext: 0, progress: 1 };
  }

  const floor = TIER_THRESHOLDS[tier];
  const ceiling = TIER_THRESHOLDS[nextTier];
  const progress = (points - floor) / (ceiling - floor);
  return {
    tier,
    nextTier,
    pointsToNext: Math.max(0, ceiling - points),
    progress: Math.max(0, Math.min(1, progress)),
  };
}
