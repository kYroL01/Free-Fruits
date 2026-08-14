import { cooldownStatus } from './cooldown';
import { isInSeason, nextSeasonMonthName } from './season';
import type { PermissionStatus } from '../types';

export type CheckinDecision =
  | { allowed: false; reasonCode: 'location_unavailable' }
  | { allowed: false; reasonCode: 'own_tree' }
  | { allowed: false; reasonCode: 'too_far' }
  | { allowed: false; reasonCode: 'on_cooldown'; opensInDays: number }
  | { allowed: false; reasonCode: 'out_of_season'; opensInMonth: string }
  | { allowed: true; reasonCode: 'ok' };

export type CheckinInput = {
  isOwnTree: boolean;
  withinCheckinRadius: boolean;
  lastReportAt: string | null;
  seasonWindow: [number, number];
  locationPermission: PermissionStatus;
  now: Date;
};

/** Aggregate check-in eligibility — the single source of truth for the check-in button's
 * label/enablement on the tree detail screen. Location denied/unavailable disables logging and
 * check-ins outright; there is no manual coordinate entry, since that would break the proof model. */
export function canCheckIn(input: CheckinInput): CheckinDecision {
  if (input.locationPermission !== 'granted') {
    return { allowed: false, reasonCode: 'location_unavailable' };
  }
  if (input.isOwnTree) {
    return { allowed: false, reasonCode: 'own_tree' };
  }
  if (!input.withinCheckinRadius) {
    return { allowed: false, reasonCode: 'too_far' };
  }

  const cooldown = cooldownStatus(input.lastReportAt, input.now);
  if (cooldown.onCooldown) {
    return { allowed: false, reasonCode: 'on_cooldown', opensInDays: cooldown.opensInDays };
  }

  if (!isInSeason(input.seasonWindow, input.now)) {
    return {
      allowed: false,
      reasonCode: 'out_of_season',
      opensInMonth: nextSeasonMonthName(input.seasonWindow, input.now),
    };
  }

  return { allowed: true, reasonCode: 'ok' };
}

export function checkinDecisionCopy(decision: CheckinDecision): string {
  switch (decision.reasonCode) {
    case 'location_unavailable':
      return 'Turn on location to check in';
    case 'own_tree':
      return 'Your discovery · credit is yours';
    case 'too_far':
      return 'Get within 25 m to check in';
    case 'on_cooldown':
      return `Reported · opens in ${decision.opensInDays} days`;
    case 'out_of_season':
      return `Out of season · opens in ${decision.opensInMonth}`;
    case 'ok':
      return 'Check in';
  }
}
