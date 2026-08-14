import { TIER_THRESHOLDS, computeTier, tierProgress } from '../tiers';

describe('tiers', () => {
  it('computes each tier from its threshold', () => {
    expect(computeTier(0)).toBe('sprout');
    expect(computeTier(249)).toBe('sprout');
    expect(computeTier(250)).toBe('picker');
    expect(computeTier(999)).toBe('picker');
    expect(computeTier(1000)).toBe('forager');
    expect(computeTier(1999)).toBe('forager');
    expect(computeTier(2000)).toBe('orchardist');
    expect(computeTier(50000)).toBe('orchardist');
  });

  it('reports progress toward the next tier', () => {
    // Forager (1000) -> Orchardist (2000): 1240 is 24% of the way.
    const progress = tierProgress(1240);
    expect(progress.tier).toBe('forager');
    expect(progress.nextTier).toBe('orchardist');
    expect(progress.pointsToNext).toBe(760);
    expect(progress.progress).toBeCloseTo(0.24, 5);
  });

  it('caps progress at 1 for the top tier with no next tier', () => {
    const progress = tierProgress(TIER_THRESHOLDS.orchardist + 500);
    expect(progress.nextTier).toBeNull();
    expect(progress.progress).toBe(1);
    expect(progress.pointsToNext).toBe(0);
  });

  it('starts at 0 progress exactly on a tier threshold', () => {
    expect(tierProgress(250).progress).toBe(0);
  });
});
