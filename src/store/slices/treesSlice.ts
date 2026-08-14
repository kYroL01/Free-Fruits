import type { StateCreator } from 'zustand';

import type { Tree } from '@/domain/types';
import { buildSeedTrees } from '@/server/seedData/trees';

export type TreesSlice = {
  trees: Record<string, Tree>;
  upsertTree: (tree: Tree) => void;
  patchTree: (id: string, patch: Partial<Tree>) => void;
};

function seedTreesById(): Record<string, Tree> {
  const record: Record<string, Tree> = {};
  for (const tree of buildSeedTrees()) record[tree.id] = tree;
  return record;
}

export const createTreesSlice: StateCreator<TreesSlice, [], [], TreesSlice> = (set) => ({
  trees: seedTreesById(),
  upsertTree: (tree) => set((s) => ({ trees: { ...s.trees, [tree.id]: tree } })),
  patchTree: (id, patch) =>
    set((s) => {
      const existing = s.trees[id];
      if (!existing) return s;
      return { trees: { ...s.trees, [id]: { ...existing, ...patch } } };
    }),
});
