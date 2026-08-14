import { DUPLICATE_RADIUS_M, distanceMeters } from './distance';
import type { LatLng, Tree } from '../types';

/** A pin within 8m of an existing tree forces the duplicate flow. Returns the nearest such
 * tree, or null if the new pin is clear. */
export function findDuplicateCandidate(pin: LatLng, trees: Tree[]): Tree | null {
  let nearest: Tree | null = null;
  let nearestDist = Infinity;

  for (const tree of trees) {
    const d = distanceMeters(pin, tree.location);
    if (d <= DUPLICATE_RADIUS_M && d < nearestDist) {
      nearest = tree;
      nearestDist = d;
    }
  }

  return nearest;
}
