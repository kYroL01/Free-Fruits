import type { StateCreator } from 'zustand';

import type { Alert } from '@/domain/types';
import { buildSeedAlerts } from '@/server/seedData/alerts';

export type AlertsSlice = {
  alerts: Alert[];
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  addAlert: (alert: Alert) => void;
};

export const createAlertsSlice: StateCreator<AlertsSlice, [], [], AlertsSlice> = (set) => ({
  alerts: buildSeedAlerts(),
  markAlertRead: (id) =>
    set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) })),
  markAllAlertsRead: () => set((s) => ({ alerts: s.alerts.map((a) => ({ ...a, read: true })) })),
  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts] })),
});
