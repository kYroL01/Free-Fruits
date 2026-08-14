import { isInSeason, nextSeasonMonthName } from '../season';

describe('season', () => {
  it('handles a non-wrapping window (Fig 5-8)', () => {
    expect(isInSeason([5, 8], new Date(2026, 5, 1))).toBe(true); // June
    expect(isInSeason([5, 8], new Date(2026, 8, 1))).toBe(true); // September (inclusive end)
    expect(isInSeason([5, 8], new Date(2026, 4, 1))).toBe(false); // May
    expect(isInSeason([5, 8], new Date(2026, 9, 1))).toBe(false); // October
  });

  it('handles a wrapping window (Orange 10-2, Nov through Mar)', () => {
    expect(isInSeason([10, 2], new Date(2026, 10, 1))).toBe(true); // November (start)
    expect(isInSeason([10, 2], new Date(2026, 11, 1))).toBe(true); // December
    expect(isInSeason([10, 2], new Date(2026, 0, 1))).toBe(true); // January
    expect(isInSeason([10, 2], new Date(2026, 2, 1))).toBe(true); // March (end)
    expect(isInSeason([10, 2], new Date(2026, 3, 1))).toBe(false); // April
    expect(isInSeason([10, 2], new Date(2026, 9, 1))).toBe(false); // October
  });

  it('an evergreen window (0-11) is always in season', () => {
    for (let m = 0; m < 12; m++) {
      expect(isInSeason([0, 11], new Date(2026, m, 1))).toBe(true);
    }
  });

  it('reports the next season month name when out of season', () => {
    expect(nextSeasonMonthName([5, 8], new Date(2026, 0, 1))).toBe('June');
  });

  it('reports the current month name when already in season', () => {
    expect(nextSeasonMonthName([5, 8], new Date(2026, 6, 15))).toBe('July');
  });
});
