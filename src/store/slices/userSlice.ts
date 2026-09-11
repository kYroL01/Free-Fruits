import type { StateCreator } from 'zustand';

export type UserSlice = {
  userId: string;
  displayName: string;
  handle: string;
  points: number;
  treeCount: number;
  strikes: number;
  inviteCode: string;
  avatarId: string;
  redeemedRewards: string[];
  setDisplayName: (name: string) => void;
  /** Adopts the signed-in account: the profile follows the Supabase user, not the device. */
  adoptAccount: (userId: string, displayName: string) => void;
  /** Drops profile state on sign-out so the next account starts clean on a shared device. */
  resetProfile: () => void;
  setAvatarId: (id: string) => void;
  addPoints: (delta: number) => void;
  incrementTreeCount: () => void;
  setStrikes: (strikes: number) => void;
  regenerateInviteCode: () => void;
  markRewardRedeemed: (rewardId: string) => void;
};

function randomInviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  userId: 'me',
  /** Empty means the user has not chosen one; the UI falls back to a localised default. */
  displayName: '',
  handle: 'you_in_valencia',
  points: 1240,
  treeCount: 2,
  strikes: 0,
  inviteCode: 'FRUIT42',
  avatarId: 'fig',
  redeemedRewards: [],
  setDisplayName: (name) => set({ displayName: name }),
  adoptAccount: (userId, displayName) =>
    set((s) => ({ userId, displayName: displayName || s.displayName })),
  resetProfile: () =>
    set({
      userId: 'me',
      displayName: '',
      points: 0,
      treeCount: 0,
      strikes: 0,
      redeemedRewards: [],
    }),
  setAvatarId: (id) => set({ avatarId: id }),
  addPoints: (delta) => set((s) => ({ points: Math.max(0, s.points + delta) })),
  incrementTreeCount: () => set((s) => ({ treeCount: s.treeCount + 1 })),
  setStrikes: (strikes) => set({ strikes }),
  regenerateInviteCode: () => set({ inviteCode: randomInviteCode() }),
  markRewardRedeemed: (rewardId) =>
    set((s) => ({ redeemedRewards: [...s.redeemedRewards, rewardId] })),
});
