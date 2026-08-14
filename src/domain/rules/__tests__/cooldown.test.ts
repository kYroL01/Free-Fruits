import { COOLDOWN_DAYS, cooldownStatus } from '../cooldown';

describe('cooldown', () => {
  it('is never on cooldown with no prior report', () => {
    expect(cooldownStatus(null, new Date()).onCooldown).toBe(false);
  });

  it('is on cooldown just under 30 days', () => {
    const now = new Date(2026, 0, 30);
    const last = new Date(2026, 0, 1).toISOString();
    const status = cooldownStatus(last, now);
    expect(status.onCooldown).toBe(true);
    expect(status.opensInDays).toBe(1);
  });

  it('opens exactly at 30 days', () => {
    const last = new Date(2026, 0, 1);
    const now = new Date(last);
    now.setDate(now.getDate() + COOLDOWN_DAYS);
    expect(cooldownStatus(last.toISOString(), now).onCooldown).toBe(false);
  });

  it('stays open well beyond 30 days', () => {
    const now = new Date(2026, 5, 1);
    const last = new Date(2026, 0, 1).toISOString();
    expect(cooldownStatus(last, now).onCooldown).toBe(false);
  });
});
