export const QUEUE_STALE_DAYS = 7;

export type QueueGrade = { stale: true } | { stale: false; ageDays: number };

/** Queued submissions are graded on the photo's takenAt timestamp, never the moment they reach
 * the server — an offline day is never punished. A queue item older than 7 days is refused
 * outright: the pin can no longer be trusted. */
export function gradeQueueAge(takenAt: string, now: Date): QueueGrade {
  const ageMs = now.getTime() - new Date(takenAt).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays > QUEUE_STALE_DAYS) return { stale: true };
  return { stale: false, ageDays };
}
