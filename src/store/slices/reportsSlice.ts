import type { StateCreator } from 'zustand';

import type { ConditionReason, ConditionKind, MyReport } from '@/domain/types';
import { buildSeedMyReports } from '@/server/seedData/myReports';

export type ReportsSlice = {
  myReports: Record<string, MyReport>;
  recordReport: (treeId: string, kind: ConditionKind, reason: ConditionReason, at: string) => void;
};

export const createReportsSlice: StateCreator<ReportsSlice, [], [], ReportsSlice> = (set) => ({
  myReports: buildSeedMyReports(),
  recordReport: (treeId, kind, reason, at) =>
    set((s) => ({ myReports: { ...s.myReports, [treeId]: { treeId, kind, reason, at } } })),
});
