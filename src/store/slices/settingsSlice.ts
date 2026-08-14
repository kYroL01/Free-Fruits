import type { StateCreator } from 'zustand';

export type Units = 'metric' | 'imperial';
export type Precision = 'exact' | 'blur' | 'private';

export type SettingsSlice = {
  darkMode: boolean;
  units: Units;
  precision: Precision;
  trailOptIn: boolean;
  harvestOptIn: boolean;
  hasOnboarded: boolean;
  toggleDarkMode: () => void;
  setUnits: (units: Units) => void;
  setPrecision: (precision: Precision) => void;
  setTrailOptIn: (value: boolean) => void;
  setHarvestOptIn: (value: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  darkMode: false,
  units: 'metric',
  precision: 'exact',
  trailOptIn: true,
  harvestOptIn: false,
  hasOnboarded: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  setUnits: (units) => set({ units }),
  setPrecision: (precision) => set({ precision }),
  setTrailOptIn: (value) => set({ trailOptIn: value }),
  setHarvestOptIn: (value) => set({ harvestOptIn: value }),
  completeOnboarding: () => set({ hasOnboarded: true }),
  resetOnboarding: () => set({ hasOnboarded: false }),
});
