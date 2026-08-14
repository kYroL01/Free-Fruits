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
  displayName: 'Forager',
  handle: 'you_in_valencia',
  points: 1240,
  treeCount: 2,
  strikes: 0,
  inviteCode: 'FRUIT42',
  avatarId: 'fig',
  redeemedRewards: [],
  setDisplayName: (name) => set({ displayName: name }),
  setAvatarId: (id) => set({ avatarId: id }),
  addPoints: (delta) => set((s) => ({ points: Math.max(0, s.points + delta) })),
  incrementTreeCount: () => set((s) => ({ treeCount: s.treeCount + 1 })),
  setStrikes: (strikes) => set({ strikes }),
  regenerateInviteCode: () => set({ inviteCode: randomInviteCode() }),
  markRewardRedeemed: (rewardId) =>
    set((s) => ({ redeemedRewards: [...s.redeemedRewards, rewardId] })),
});
