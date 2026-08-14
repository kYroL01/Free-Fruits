import { STRIKE_PENALTY_POINTS } from '../points';
import { STRIKES_BEFORE_PENALTY, applyStrike } from '../strikes';

describe('strikes', () => {
  it('the first two rejections cost nothing and increment the counter', () => {
    const first = applyStrike(0);
    expect(first).toEqual({ newStrikeCount: 1, pointsPenalty: 0 });

    const second = applyStrike(first.newStrikeCount);
    expect(second).toEqual({ newStrikeCount: 2, pointsPenalty: 0 });
  });

  it('the 3rd rejection costs 5 points and resets the counter', () => {
    const third = applyStrike(2);
    expect(third.newStrikeCount).toBe(0);
    expect(third.pointsPenalty).toBe(STRIKE_PENALTY_POINTS);
  });

  it('STRIKES_BEFORE_PENALTY is 3', () => {
    expect(STRIKES_BEFORE_PENALTY).toBe(3);
  });
});
