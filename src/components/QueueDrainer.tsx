import { useEffect, useRef } from 'react';
import * as Crypto from 'expo-crypto';

import { useAppStore } from '@/store';
import { t } from '@/i18n';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { drainQueue } from '@/server/mockServer';
import { findSpecies } from '@/server/seedData/species';

/** No UI — mounted once at the root. Drains the offline queue the moment the device reconnects,
 * grading each item against its photo's takenAt (never the reconnect moment), per the spec's
 * "an offline day is never punished" rule. */
export function QueueDrainer() {
  const { isConnected } = useNetworkStatus();
  const queue = useAppStore((s) => s.queue);
  const trees = useAppStore((s) => s.trees);
  const userId = useAppStore((s) => s.userId);
  const finderHandle = useAppStore((s) => s.handle);
  const removeFromQueue = useAppStore((s) => s.removeFromQueue);
  const upsertTree = useAppStore((s) => s.upsertTree);
  const addPoints = useAppStore((s) => s.addPoints);
  const incrementTreeCount = useAppStore((s) => s.incrementTreeCount);
  const addAlert = useAppStore((s) => s.addAlert);

  const wasConnected = useRef(isConnected);
  const draining = useRef(false);

  useEffect(() => {
    const justReconnected = !wasConnected.current && isConnected;
    wasConnected.current = isConnected;

    if (!justReconnected || queue.length === 0 || draining.current) return;

    draining.current = true;
    (async () => {
      const outcomes = await drainQueue({
        queue,
        speciesLookup: findSpecies,
        existingTrees: Object.values(trees),
        finderId: userId,
        finderHandle,
      });

      for (const outcome of outcomes) {
        removeFromQueue(outcome.itemId);

        if (outcome.outcome === 'success') {
          upsertTree(outcome.tree);
          addPoints(outcome.points);
          incrementTreeCount();
          continue;
        }

        if (outcome.outcome === 'stale') {
          addAlert({
            id: Crypto.randomUUID(),
            kind: 'info',
            title: t('queue.expiredTitle'),
            body: t('queue.expiredBody'),
            at: new Date().toISOString(),
            read: false,
          });
          continue;
        }

        // duplicate
        addAlert({
          id: Crypto.randomUUID(),
          kind: 'claim_review',
          title: t('queue.duplicateTitle'),
          body: t('queue.duplicateBody'),
          at: new Date().toISOString(),
          read: false,
          treeId: outcome.candidate.id,
        });
      }

      draining.current = false;
    })();
  }, [
    isConnected,
    queue,
    trees,
    userId,
    finderHandle,
    removeFromQueue,
    upsertTree,
    addPoints,
    incrementTreeCount,
    addAlert,
  ]);

  return null;
}
