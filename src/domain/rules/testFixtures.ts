import type { Tree } from '../types';

export function makeTree(overrides: Partial<Tree> = {}): Tree {
  return {
    id: 't1',
    speciesId: 'orange',
    rarity: 'common',
    points: 10,
    location: { lat: 39.4699, lng: -0.3763 },
    street: 'Test street',
    finderId: 'other-user',
    finderHandle: 'other_user',
    confirmations: 0,
    confirmationsNeeded: 2,
    pending: true,
    fence: false,
    photoUri: null,
    latestReport: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
