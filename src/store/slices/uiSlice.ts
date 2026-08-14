import type { StateCreator } from 'zustand';

import type { Filters, LatLng } from '@/domain/types';

export type { Filters } from '@/domain/types';
export { DISTANCE_STEPS_M } from '@/domain/types';

export type ActiveModal =
  | { type: 'no_location' }
  | { type: 'condition_report'; treeId: string }
  | {
      type: 'duplicate';
      pin: LatLng;
      speciesId: string;
      photoUri: string;
      street: string;
      takenAt: string;
      candidateTreeId: string;
    }
  | { type: 'success'; points: number; pending: 'community_check' | 'duplicate_review' }
  | { type: 'avatar_picker' }
  | { type: 'invite_link' }
  | { type: 'send_failure'; onRetry: () => void; onLater: () => void }
  | { type: 'queued'; points: number; queueCount: number };

const defaultFilters: Filters = {
  kinds: { fruit: false, herb: false },
  rarity: { common: false, rare: false, legendary: false },
  radiusStep: 4,
  verifiedOnly: false,
  inSeasonOnly: false,
  noFenceOnly: false,
  notVisitedOnly: false,
};

export type UiSlice = {
  activeModal: ActiveModal | null;
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
};

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  filters: defaultFilters,
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: defaultFilters }),
});
