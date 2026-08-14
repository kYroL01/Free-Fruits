import type { StateCreator } from 'zustand';

import type { QueueItem, QueueItemStatus } from '@/domain/types';

export type QueueSlice = {
  queue: QueueItem[];
  enqueue: (item: QueueItem) => void;
  updateQueueStatus: (id: string, status: QueueItemStatus) => void;
  removeFromQueue: (id: string) => void;
};

export const createQueueSlice: StateCreator<QueueSlice, [], [], QueueSlice> = (set) => ({
  queue: [],
  enqueue: (item) => set((s) => ({ queue: [...s.queue, item] })),
  updateQueueStatus: (id, status) =>
    set((s) => ({ queue: s.queue.map((q) => (q.id === id ? { ...q, status } : q)) })),
  removeFromQueue: (id) => set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),
});
