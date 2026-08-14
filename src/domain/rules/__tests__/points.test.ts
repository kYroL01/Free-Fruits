import {
  CHECKIN_FIRST_POINTS,
  CHECKIN_REPEAT_POINTS,
  UNLISTED_SPECIES_POINTS,
  checkinPoints,
  computeNewTreePoints,
} from '../points';
import type { Species } from '../../types';

const FIG: Species = { id: 'fig', name: 'Fig', kind: 'fruit', rarity: 'rare', points: 30, seasonWindow: [5, 8] };

describe('points', () => {
  it('awards the species catalogue value for a listed species', () => {
    expect(computeNewTreePoints(FIG)).toBe(30);
  });

  it('awards 15 (Unrated) for an unlisted species', () => {
    expect(computeNewTreePoints(null)).toBe(UNLISTED_SPECIES_POINTS);
  });

  it('awards 5 for a first checkin and 3 for a repeat', () => {
    expect(checkinPoints(true)).toBe(CHECKIN_FIRST_POINTS);
    expect(checkinPoints(false)).toBe(CHECKIN_REPEAT_POINTS);
  });
});
