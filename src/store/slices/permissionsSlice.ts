import type { StateCreator } from 'zustand';

import type { PermissionStatus } from '@/domain/types';

export type PermissionsSlice = {
  permissions: {
    location: PermissionStatus;
    camera: PermissionStatus;
    notifications: PermissionStatus;
  };
  setPermission: (kind: 'location' | 'camera' | 'notifications', status: PermissionStatus) => void;
};

export const createPermissionsSlice: StateCreator<PermissionsSlice, [], [], PermissionsSlice> = (
  set
) => ({
  permissions: {
    location: 'undetermined',
    camera: 'undetermined',
    notifications: 'undetermined',
  },
  setPermission: (kind, status) =>
    set((s) => ({ permissions: { ...s.permissions, [kind]: status } })),
});
