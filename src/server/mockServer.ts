import * as Crypto from 'expo-crypto';

import {
  canCheckIn,
  checkinPoints,
  computeNewTreePoints,
  findDuplicateCandidate,
  gradeQueueAge,
  isWithinProofRadius,
} from '@/domain/rules';
import type {
  ConditionKind,
  ConditionReason,
  LatLng,
  PermissionStatus,
  QueueItem,
  Species,
  Tree,
} from '@/domain/types';
import { delay } from './delay';

export type SubmitTreeResult =
  | { outcome: 'no_location' }
  | { outcome: 'duplicate'; candidate: Tree }
  | { outcome: 'success'; tree: Tree; points: number };

export type SubmitTreeParams = {
  species: Species | null;
  pin: LatLng;
  photoUri: string;
  exifGps: LatLng | null;
  finderId: string;
  finderHandle: string;
  street: string;
  existingTrees: Tree[];
};

/** Log a new tree. Proof (photo GPS within ~3m of the pin) and duplicate detection are both
 * enforced here, server-side — never trusted from the UI. */
export async function submitNewTree(params: SubmitTreeParams): Promise<SubmitTreeResult> {
  await delay();

  if (!params.exifGps || !isWithinProofRadius(params.exifGps, params.pin)) {
    return { outcome: 'no_location' };
  }

  const duplicate = findDuplicateCandidate(params.pin, params.existingTrees);
  if (duplicate) {
    return { outcome: 'duplicate', candidate: duplicate };
  }

  const points = computeNewTreePoints(params.species);
  const tree: Tree = {
    id: Crypto.randomUUID(),
    speciesId: params.species?.id ?? 'unlisted',
    rarity: params.species?.rarity ?? 'unrated',
    points,
    location: params.pin,
    street: params.street,
    finderId: params.finderId,
    finderHandle: params.finderHandle,
    confirmations: 0,
    confirmationsNeeded: 2,
    pending: true,
    fence: false,
    photoUri: params.photoUri,
    latestReport: null,
    createdAt: new Date().toISOString(),
  };

  return { outcome: 'success', tree, points };
}

export type ConfirmSameTreeResult = { points: number; confirmations: number };

/** Confirming an existing pin is the same tree — +5 immediately, one step closer to verified. */
export async function confirmSameTree(tree: Tree): Promise<ConfirmSameTreeResult> {
  await delay();
  return { points: 5, confirmations: Math.min(tree.confirmationsNeeded, tree.confirmations + 1) };
}

export type DuplicateClaimReason = 'different_species' | 'second_trunk' | 'wrong_tree';

export type SubmitDuplicateClaimResult = { held: true; strikeApplied: boolean };

/** Claiming a separate tree near an existing pin holds all points pending review by the
 * finder + two foragers. The strike itself is only applied on rejection (see strikes.ts),
 * handled by the caller once the jury outcome is known — this just records the claim was made. */
export async function submitDuplicateClaim(
  _candidate: Tree,
  _reason: DuplicateClaimReason
): Promise<SubmitDuplicateClaimResult> {
  await delay();
  return { held: true, strikeApplied: false };
}

export type CheckinParams = {
  tree: Tree;
  kind: ConditionKind;
  reason: ConditionReason;
  isOwnTree: boolean;
  withinCheckinRadius: boolean;
  lastReportAt: string | null;
  seasonWindow: [number, number];
  locationPermission: PermissionStatus;
  isFirstCheckinForUser: boolean;
  now?: Date;
};

export type CheckinResult =
  | { allowed: false; reasonCode: string }
  | { allowed: true; points: number };

export async function checkIn(params: CheckinParams): Promise<CheckinResult> {
  await delay();

  const decision = canCheckIn({
    isOwnTree: params.isOwnTree,
    withinCheckinRadius: params.withinCheckinRadius,
    lastReportAt: params.lastReportAt,
    seasonWindow: params.seasonWindow,
    locationPermission: params.locationPermission,
    now: params.now ?? new Date(),
  });

  if (!decision.allowed) {
    return { allowed: false, reasonCode: decision.reasonCode };
  }

  return { allowed: true, points: checkinPoints(params.isFirstCheckinForUser) };
}

export type FlagReason =
  | 'disease_pest'
  | 'dry'
  | 'burnt'
  | 'removed'
  | 'fenced_off'
  | 'not_real_tree'
  | 'private_property'
  | 'wrong_species'
  | 'offensive_photo';

/** Routes to the tree's finder + two foragers with recent verified check-ins nearby — same jury
 * as a duplicate claim. The UI only needs to know it was accepted. */
export async function flagTree(_treeId: string, _reason: FlagReason): Promise<{ status: 'sent' }> {
  await delay();
  return { status: 'sent' };
}

export type RedeemRewardResult = { ok: boolean };

export async function redeemReward(cost: number, currentPoints: number): Promise<RedeemRewardResult> {
  await delay();
  return { ok: currentPoints >= cost };
}

export type QueueDrainOutcome =
  | { itemId: string; outcome: 'stale' }
  | { itemId: string; outcome: 'duplicate'; candidate: Tree }
  | { itemId: string; outcome: 'success'; tree: Tree; points: number };

export type DrainQueueParams = {
  queue: QueueItem[];
  speciesLookup: (id: string) => Species | null;
  existingTrees: Tree[];
  finderId: string;
  finderHandle: string;
  now?: Date;
};

/** Drains the offline queue on reconnect. Each item is graded against its photo's `takenAt` —
 * never the moment it reaches the server — so an offline day is never punished. Duplicate
 * detection only runs here, at drain time, since it needs the server. */
export async function drainQueue(params: DrainQueueParams): Promise<QueueDrainOutcome[]> {
  await delay();
  const now = params.now ?? new Date();
  const results: QueueDrainOutcome[] = [];
  const accepted: Tree[] = [];

  for (const item of params.queue) {
    const age = gradeQueueAge(item.takenAt, now);
    if (age.stale) {
      results.push({ itemId: item.id, outcome: 'stale' });
      continue;
    }

    const duplicate = findDuplicateCandidate(item.pin, [...params.existingTrees, ...accepted]);
    if (duplicate) {
      results.push({ itemId: item.id, outcome: 'duplicate', candidate: duplicate });
      continue;
    }

    const species = params.speciesLookup(item.speciesId);
    const points = computeNewTreePoints(species);
    const tree: Tree = {
      id: Crypto.randomUUID(),
      speciesId: item.speciesId,
      rarity: species?.rarity ?? 'unrated',
      points,
      location: item.pin,
      street: '',
      finderId: params.finderId,
      finderHandle: params.finderHandle,
      confirmations: 0,
      confirmationsNeeded: 2,
      pending: true,
      fence: false,
      photoUri: item.photoUri,
      latestReport: null,
      createdAt: item.takenAt,
    };
    accepted.push(tree);
    results.push({ itemId: item.id, outcome: 'success', tree, points });
  }

  return results;
}
