import type { MyReport } from '@/domain/types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/**
 * One report by the current user, recent enough to sit inside the 30-day cooldown, so the
 * "Reported · opens in N days" state is reachable on a fresh install rather than only after
 * filing a report by hand.
 *
 * t18 is chosen deliberately: a fig found by ana_p, so it is not the user's own tree (which
 * would short-circuit to `own_tree`), and figs run June–September, so the season check cannot
 * mask the cooldown either.
 */
export function buildSeedMyReports(): Record<string, MyReport> {
  return {
    t18: { treeId: 't18', kind: 'good', reason: 'fruit_ready', at: daysAgo(8) },
  };
}
