import type { StateCreator } from 'zustand';

import type { ConditionReason, ConditionKind, MyReport } from '@/domain/types';

export type ReportsSlice = {
  myReports: Record<string, MyReport>;
  recordReport: (treeId: string, kind: ConditionKind, reason: ConditionReason, at: string) => void;
};

export const createReportsSlice: StateCreator<ReportsSlice, [], [], ReportsSlice> = (set) => ({
  myReports: {},
  recordReport: (treeId, kind, reason, at) =>
    set((s) => ({ myReports: { ...s.myReports, [treeId]: { treeId, kind, reason, at } } })),
});
