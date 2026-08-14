import { canCheckIn } from '../checkin';

const BASE = {
  isOwnTree: false,
  withinCheckinRadius: true,
  lastReportAt: null as string | null,
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
    const lastReportAt = new Date(2026, 5, 10).toISOString(); // 5 days before `now`
    const decision = canCheckIn({ ...BASE, lastReportAt });
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
