import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createSettingsSlice, type SettingsSlice } from './slices/settingsSlice';
import { createUserSlice, type UserSlice } from './slices/userSlice';
import { createTreesSlice, type TreesSlice } from './slices/treesSlice';
import { createReportsSlice, type ReportsSlice } from './slices/reportsSlice';
import { createQueueSlice, type QueueSlice } from './slices/queueSlice';
import { createAlertsSlice, type AlertsSlice } from './slices/alertsSlice';
import { createPermissionsSlice, type PermissionsSlice } from './slices/permissionsSlice';
import { createUiSlice, type UiSlice } from './slices/uiSlice';

export type AppState = SettingsSlice &
  UserSlice &
  TreesSlice &
  ReportsSlice &
  QueueSlice &
  AlertsSlice &
  PermissionsSlice &
  UiSlice;

// Ephemeral state (ui, permissions) is excluded from persistence: permissions are always
// re-checked live against the OS, and ui.activeModal/filters shouldn't survive a cold start.
const PERSISTED_KEYS = [
  'darkMode',
  'units',
  'precision',
  'trailOptIn',
  'harvestOptIn',
  'hasOnboarded',
  'userId',
  'displayName',
  'handle',
  'points',
  'treeCount',
  'strikes',
  'inviteCode',
  'avatarId',
  'redeemedRewards',
  'trees',
  'myReports',
  'queue',
  'alerts',
] as const satisfies readonly (keyof AppState)[];

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createSettingsSlice(...a),
      ...createUserSlice(...a),
      ...createTreesSlice(...a),
      ...createReportsSlice(...a),
      ...createQueueSlice(...a),
      ...createAlertsSlice(...a),
      ...createPermissionsSlice(...a),
      ...createUiSlice(...a),
    }),
    {
      name: 'free-fruits-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        Object.fromEntries(PERSISTED_KEYS.map((key) => [key, state[key]])) as Partial<AppState>,
    }
  )
);

export * from './slices/settingsSlice';
export * from './slices/userSlice';
export * from './slices/treesSlice';
export * from './slices/reportsSlice';
export * from './slices/queueSlice';
export * from './slices/alertsSlice';
export * from './slices/permissionsSlice';
export * from './slices/uiSlice';
