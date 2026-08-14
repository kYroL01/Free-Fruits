export type Rarity = 'common' | 'rare' | 'legendary' | 'unrated';
export type SpeciesKind = 'fruit' | 'herb';

export type Species = {
  id: string;
  name: string;
  kind: SpeciesKind;
  rarity: Rarity;
  points: number;
  /** Inclusive month-index window [startMonth, endMonth], 0 = January, wraps (e.g. 10 -> 2 spans Nov-Mar). */
  seasonWindow: [number, number];
};

export type LatLng = { lat: number; lng: number };

export type ConditionKind = 'good' | 'bad';
export type GoodReason = 'fruit_ready' | 'fruit_ripening' | 'season_over';
export type BadReason = 'disease_pest' | 'dry' | 'burnt' | 'removed' | 'fenced_off';
export type ConditionReason = GoodReason | BadReason;

export type ConditionReport = {
  kind: ConditionKind;
  reason: ConditionReason;
  at: string; // ISO timestamp
  by: string; // user id
};

export type Tree = {
  id: string;
  speciesId: string;
  rarity: Rarity;
  points: number;
  location: LatLng;
  street: string;
  finderId: string;
  finderHandle: string;
  confirmations: number;
  confirmationsNeeded: number;
  pending: boolean;
  fence: boolean;
  photoUri: string | null;
  latestReport: ConditionReport | null;
  createdAt: string;
  strikeReasons?: string[];
};

export type MyReport = {
  treeId: string;
  kind: ConditionKind;
  reason: ConditionReason;
  at: string;
};

export type QueueItemStatus = 'pending' | 'sending' | 'failed';

export type QueueItem = {
  id: string;
  photoUri: string;
  exifGps: LatLng | null;
  speciesId: string;
  pin: LatLng;
  takenAt: string; // ISO timestamp of capture, NOT enqueue time — used for season/cooldown grading
  status: QueueItemStatus;
};

export type AlertKind = 'nearby_unverified' | 'claim_review' | 'reopened_checkin' | 'info';

export type Alert = {
  id: string;
  kind: AlertKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  treeId?: string;
};

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export type Permissions = {
  location: PermissionStatus;
  camera: PermissionStatus;
  notifications: PermissionStatus;
};

export type Tier = 'sprout' | 'picker' | 'forager' | 'orchardist';

export type Avatar = {
  id: string;
  label: string;
};

export const DISTANCE_STEPS_M = [300, 600, 2000, 5000, Infinity] as const;

export type Filters = {
  kinds: { fruit: boolean; herb: boolean };
  rarity: { common: boolean; rare: boolean; legendary: boolean };
  radiusStep: 0 | 1 | 2 | 3 | 4;
  verifiedOnly: boolean;
  inSeasonOnly: boolean;
  noFenceOnly: boolean;
  notVisitedOnly: boolean;
};

export type User = {
  id: string;
  displayName: string;
  handle: string;
  points: number;
  treeCount: number;
  strikes: number;
  inviteCode: string;
  avatarId: string;
};
