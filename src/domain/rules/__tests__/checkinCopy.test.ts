import { canCheckIn, checkinDecisionCopy, type CheckinDecision } from '../checkin';
import { nextSeasonMonthName } from '../season';
import { i18n } from '@/i18n';

/**
 * checkinDecisionCopy held six hardcoded English sentences, and nextSeasonMonthName fed it English
 * month names, so a Spanish device read the check-in button in English. Both now resolve through
 * the catalogue. These assert the literal strings in both locales rather than comparing against the
 * catalogue itself, so a hardcoded sentence creeping back in fails here even though the English
 * output would look correct. Fallback is enabled, so a missing Spanish key silently answers in
 * English — the exact Spanish assertions are what catch that too.
 */

const DECISIONS: Record<string, CheckinDecision> = {
  location_unavailable: { allowed: false, reasonCode: 'location_unavailable' },
  own_tree: { allowed: false, reasonCode: 'own_tree' },
  too_far: { allowed: false, reasonCode: 'too_far' },
  on_cooldown: { allowed: false, reasonCode: 'on_cooldown', opensInDays: 22 },
  out_of_season: { allowed: false, reasonCode: 'out_of_season', opensInMonth: 'November' },
  ok: { allowed: true, reasonCode: 'ok' },
};

describe('checkinDecisionCopy', () => {
  const original = i18n.locale;
  afterEach(() => {
    i18n.locale = original;
  });

  it('renders every decision in English', () => {
    i18n.locale = 'en';
    expect(checkinDecisionCopy(DECISIONS.location_unavailable)).toBe('Turn on location to check in');
    expect(checkinDecisionCopy(DECISIONS.own_tree)).toBe('Your discovery · credit is yours');
    expect(checkinDecisionCopy(DECISIONS.too_far)).toBe('Get within 25 m to check in');
    expect(checkinDecisionCopy(DECISIONS.on_cooldown)).toBe('Reported · opens in 22 days');
    expect(checkinDecisionCopy(DECISIONS.out_of_season)).toBe('Out of season · opens in November');
    expect(checkinDecisionCopy(DECISIONS.ok)).toBe('Check in');
  });

  it('renders every decision in Spanish — no English sentence survives the switch', () => {
    i18n.locale = 'es';
    expect(checkinDecisionCopy(DECISIONS.location_unavailable)).toBe(
      'Activa la ubicación para confirmar'
    );
    expect(checkinDecisionCopy(DECISIONS.own_tree)).toBe('Tu descubrimiento · el mérito es tuyo');
    expect(checkinDecisionCopy(DECISIONS.too_far)).toBe('Acércate a menos de 25 m para confirmar');
    expect(checkinDecisionCopy(DECISIONS.ok)).toBe('Estoy en el árbol');
  });

  it('interpolates the day count into the cooldown sentence', () => {
    i18n.locale = 'es';
    const copy = checkinDecisionCopy({ allowed: false, reasonCode: 'on_cooldown', opensInDays: 22 });
    expect(copy).toBe('Ya informado · abre en 22 días');
    expect(copy).not.toContain('{{count}}');
  });

  it('interpolates the month into the out-of-season sentence', () => {
    i18n.locale = 'es';
    const copy = checkinDecisionCopy({
      allowed: false,
      reasonCode: 'out_of_season',
      opensInMonth: 'noviembre',
    });
    expect(copy).toBe('Fuera de temporada · abre en noviembre');
    expect(copy).not.toContain('{{month}}');
  });
});

describe('nextSeasonMonthName', () => {
  const original = i18n.locale;
  afterEach(() => {
    i18n.locale = original;
  });

  const ORANGE: [number, number] = [10, 2]; // November–February
  const JUNE = new Date(2026, 5, 15);

  it('names the month the season opens in English', () => {
    i18n.locale = 'en';
    expect(nextSeasonMonthName(ORANGE, JUNE)).toBe('November');
  });

  it('names it in Spanish, lowercase as Spanish months are written', () => {
    i18n.locale = 'es';
    expect(nextSeasonMonthName(ORANGE, JUNE)).toBe('noviembre');
  });

  it('names the current month while the season is already open', () => {
    i18n.locale = 'es';
    expect(nextSeasonMonthName([5, 8], JUNE)).toBe('junio');
  });
});

/** The end-to-end shape the tree detail screen actually renders: decision in, sentence out. */
describe('a Spanish device standing at a tree on cooldown', () => {
  const original = i18n.locale;
  afterEach(() => {
    i18n.locale = original;
  });

  it('reads "Ya informado · abre en 22 días"', () => {
    i18n.locale = 'es';
    const decision = canCheckIn({
      isOwnTree: false,
      withinCheckinRadius: true,
      myLastReportAt: new Date(2026, 5, 1).toISOString(),
      seasonWindow: [5, 8],
      locationPermission: 'granted',
      now: new Date(2026, 5, 9),
    });
    expect(checkinDecisionCopy(decision)).toBe('Ya informado · abre en 22 días');
  });
});
