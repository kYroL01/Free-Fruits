export const COOLDOWN_DAYS = 30;

export type CooldownStatus = { onCooldown: boolean; opensInDays: number };

/** One scoring check-in per tree per 30 days. */
export function cooldownStatus(lastReportAt: string | null, now: Date): CooldownStatus {
  if (!lastReportAt) return { onCooldown: false, opensInDays: 0 };

  const last = new Date(lastReportAt);
  const elapsedMs = now.getTime() - last.getTime();
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);

  if (elapsedDays >= COOLDOWN_DAYS) return { onCooldown: false, opensInDays: 0 };

  const opensInDays = Math.max(1, Math.ceil(COOLDOWN_DAYS - elapsedDays));
  return { onCooldown: true, opensInDays };
}
