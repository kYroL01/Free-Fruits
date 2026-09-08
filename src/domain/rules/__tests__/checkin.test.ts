import { canCheckIn } from '../checkin';
import { isInSeason } from '../season';
import { findSpecies } from '@/server/seedData/species';
import { buildSeedMyReports } from '@/server/seedData/myReports';
import { buildSeedTrees } from '@/server/seedData/trees';

const BASE = {
  isOwnTree: false,
  withinCheckinRadius: true,
  myLastReportAt: null as string | null,
  seasonWindow: [0, 11] as [number, number],
  locationPermission: 'granted' as const,
  now: new Date(2026, 5, 15),
};

describe('canCheckIn', () => {
  it('allows a check-in when every condition is satisfied', () => {
    expect(canCheckIn(BASE)).toEqual({ allowed: true, reasonCode: 'ok' });
  });

  it('blocks when location is not granted — no manual coordinate entry escape hatch', () => {
    expect(canCheckIn({ ...BASE, locationPermission: 'denied' })).toEqual({
      allowed: false,
      reasonCode: 'location_unavailable',
    });
    expect(canCheckIn({ ...BASE, locationPermission: 'undetermined' }).allowed).toBe(false);
  });

  it('blocks the finder from checking in on their own tree', () => {
    expect(canCheckIn({ ...BASE, isOwnTree: true })).toEqual({
      allowed: false,
      reasonCode: 'own_tree',
    });
  });

  it('blocks outside the 25m radius', () => {
    expect(canCheckIn({ ...BASE, withinCheckinRadius: false })).toEqual({
      allowed: false,
      reasonCode: 'too_far',
    });
  });

  it('blocks on cooldown and reports days remaining', () => {
    const myLastReportAt = new Date(2026, 5, 10).toISOString(); // 5 days before `now`
    const decision = canCheckIn({ ...BASE, myLastReportAt });
    expect(decision).toEqual({ allowed: false, reasonCode: 'on_cooldown', opensInDays: 25 });
  });

  it('blocks out of season and names the next month', () => {
    const decision = canCheckIn({ ...BASE, seasonWindow: [10, 2] }); // Orange, June is out
    expect(decision).toEqual({
      allowed: false,
      reasonCode: 'out_of_season',
      opensInMonth: 'November',
    });
  });

  it('own-tree check is evaluated before proximity/cooldown/season (fastest, clearest reason first)', () => {
    const decision = canCheckIn({ ...BASE, isOwnTree: true, withinCheckinRadius: false });
    expect(decision.reasonCode).toBe('own_tree');
  });
});

/**
 * The seeded report exists so the cooldown state is reachable on a fresh install. These guard the
 * three properties that make it reachable — it is recent, it is not the user's own tree, and the
 * cooldown gate is what the decision lands on — so a later edit to the seed cannot silently
 * re-hide the state it was added to expose.
 */
describe('the seeded cooldown state', () => {
  const seeded = buildSeedMyReports().t18;
  const tree = buildSeedTrees().find((t) => t.id === 't18')!;
  const FIG_SEASON = findSpecies('fig')!.seasonWindow;

  const seedBase = {
    isOwnTree: tree.finderId === 'me',
    withinCheckinRadius: true,
    myLastReportAt: seeded.at,
    seasonWindow: FIG_SEASON,
    locationPermission: 'granted' as const,
  };

  it('seeds a report on t18, the tree the cooldown copy is written against', () => {
    expect(seeded.treeId).toBe('t18');
  });

  it('is not the user own tree, so own_tree cannot short-circuit ahead of the cooldown', () => {
    expect(tree.finderId).not.toBe('me');
  });

  it('lands on the cooldown at whatever today happens to be', () => {
    const decision = canCheckIn({ ...seedBase, now: new Date() });
    expect(decision.reasonCode).toBe('on_cooldown');
  });

  it('reads "opens in 22 days" eight days after the report', () => {
    const now = new Date(new Date(seeded.at).getTime() + 8 * 24 * 60 * 60 * 1000);
    expect(canCheckIn({ ...seedBase, now })).toEqual({
      allowed: false,
      reasonCode: 'on_cooldown',
      opensInDays: 22,
    });
  });

  it('reports the cooldown even out of fig season — the cooldown gate is evaluated first', () => {
    const reportedAt = new Date(2026, 0, 1); // January, well outside the fig window
    const now = new Date(2026, 0, 9);
    expect(isInSeason(FIG_SEASON, now)).toBe(false);
    expect(canCheckIn({ ...seedBase, myLastReportAt: reportedAt.toISOString(), now })).toEqual({
      allowed: false,
      reasonCode: 'on_cooldown',
      opensInDays: 22,
    });
  });

  it('opens once the 30 days have passed, and the fig season then decides', () => {
    const reportedAt = new Date(2026, 5, 1);
    const inSeason = new Date(2026, 6, 5); // 34 days later, July, figs are running
    expect(canCheckIn({ ...seedBase, myLastReportAt: reportedAt.toISOString(), now: inSeason })).toEqual({
      allowed: true,
      reasonCode: 'ok',
    });

    const outOfSeason = new Date(2026, 9, 5); // the cooldown is spent, but October is not fig season
    expect(canCheckIn({ ...seedBase, myLastReportAt: reportedAt.toISOString(), now: outOfSeason })).toEqual({
      allowed: false,
      reasonCode: 'out_of_season',
      opensInMonth: 'June',
    });
  });
});
