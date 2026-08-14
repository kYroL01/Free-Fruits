import type { Species } from '@/domain/types';

/**
 * Season windows are re-seeded for Valencia's Mediterranean climate (warmer/earlier than the
 * original Milan-authored spec — e.g. loquats and citrus run longer here). These are placeholder
 * windows, not agronomically authoritative — same "botanist sets it later" workflow the product
 * already applies to Unrated species should eventually extend to these too.
 */
export const SPECIES: Species[] = [
  // Fruit
  { id: 'fig', name: 'Fig', kind: 'fruit', rarity: 'rare', points: 30, seasonWindow: [5, 8] },
  { id: 'peach', name: 'Peach', kind: 'fruit', rarity: 'legendary', points: 50, seasonWindow: [4, 6] },
  { id: 'orange', name: 'Orange', kind: 'fruit', rarity: 'common', points: 10, seasonWindow: [10, 2] },
  { id: 'lemon', name: 'Lemon', kind: 'fruit', rarity: 'common', points: 15, seasonWindow: [8, 2] },
  { id: 'mulberry', name: 'Mulberry', kind: 'fruit', rarity: 'legendary', points: 45, seasonWindow: [3, 4] },
  { id: 'loquat', name: 'Loquat', kind: 'fruit', rarity: 'rare', points: 35, seasonWindow: [1, 3] },
  { id: 'plum', name: 'Plum', kind: 'fruit', rarity: 'rare', points: 30, seasonWindow: [5, 6] },
  { id: 'cherry', name: 'Cherry', kind: 'fruit', rarity: 'legendary', points: 50, seasonWindow: [3, 4] },
  { id: 'apple', name: 'Apple', kind: 'fruit', rarity: 'common', points: 15, seasonWindow: [7, 9] },
  // Herbs & greens
  { id: 'basil', name: 'Basil', kind: 'herb', rarity: 'common', points: 10, seasonWindow: [3, 8] },
  { id: 'wild-mint', name: 'Wild mint', kind: 'herb', rarity: 'common', points: 10, seasonWindow: [2, 9] },
  { id: 'rosemary', name: 'Rosemary', kind: 'herb', rarity: 'common', points: 15, seasonWindow: [0, 11] },
  { id: 'parsley', name: 'Parsley', kind: 'herb', rarity: 'common', points: 10, seasonWindow: [1, 10] },
  { id: 'sage', name: 'Sage', kind: 'herb', rarity: 'rare', points: 25, seasonWindow: [2, 7] },
  { id: 'thyme', name: 'Thyme', kind: 'herb', rarity: 'rare', points: 25, seasonWindow: [0, 11] },
  { id: 'oregano', name: 'Oregano', kind: 'herb', rarity: 'common', points: 15, seasonWindow: [3, 8] },
  { id: 'bay-laurel', name: 'Bay laurel', kind: 'herb', rarity: 'rare', points: 25, seasonWindow: [0, 11] },
  { id: 'wild-fennel', name: 'Wild fennel', kind: 'herb', rarity: 'legendary', points: 40, seasonWindow: [4, 7] },
];

export function findSpecies(id: string): Species | null {
  return SPECIES.find((s) => s.id === id) ?? null;
}
