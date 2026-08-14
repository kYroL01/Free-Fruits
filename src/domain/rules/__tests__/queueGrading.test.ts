import { QUEUE_STALE_DAYS, gradeQueueAge } from '../queueGrading';

describe('queue grading', () => {
  it('is not stale just under 7 days', () => {
    const now = new Date(2026, 0, 8);
    const takenAt = new Date(2026, 0, 1).toISOString();
    const grade = gradeQueueAge(takenAt, now);
    expect(grade.stale).toBe(false);
  });

  it('is stale just past 7 days — the pin can no longer be trusted', () => {
    const now = new Date(2026, 0, 10);
    const takenAt = new Date(2026, 0, 1).toISOString();
    expect(gradeQueueAge(takenAt, now)).toEqual({ stale: true });
  });

  it('an offline day never counts against the item — grading uses takenAt, not receipt time', () => {
    // Captured 3 days ago, queued the whole time — still fresh, well under the 7-day limit.
    const now = new Date();
    const takenAt = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(gradeQueueAge(takenAt, now).stale).toBe(false);
  });

  it('QUEUE_STALE_DAYS is 7', () => {
    expect(QUEUE_STALE_DAYS).toBe(7);
  });
});
