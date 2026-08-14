import { distanceMeters } from './distance';
import { isInSeason } from './season';
import { DISTANCE_STEPS_M } from '../types';
import type { Filters, LatLng, MyReport, Species, Tree } from '../types';

export type FilterTreesInput = {
  trees: Tree[];
  filters: Filters;
  userLocation: LatLng | null;
  myReports: Record<string, MyReport>;
  speciesLookup: (id: string) => Species | null;
  now: Date;
};

/** Within a chip group, all-off means "no constraint" — the map never goes blank by accident. */
export function filterTrees(input: FilterTreesInput): Tree[] {
  const { trees, filters, userLocation, myReports, speciesLookup, now } = input;

  const kindsConstrained = filters.kinds.fruit || filters.kinds.herb;
  const rarityConstrained =
    filters.rarity.common || filters.rarity.rare || filters.rarity.legendary;
  const radiusM = DISTANCE_STEPS_M[filters.radiusStep];

  return trees.filter((tree) => {
    const species = speciesLookup(tree.speciesId);

    if (kindsConstrained && species) {
      const kindOn = species.kind === 'fruit' ? filters.kinds.fruit : filters.kinds.herb;
      if (!kindOn) return false;
    }

    if (rarityConstrained) {
      const rarityOn =
        (tree.rarity === 'common' && filters.rarity.common) ||
        (tree.rarity === 'rare' && filters.rarity.rare) ||
        (tree.rarity === 'legendary' && filters.rarity.legendary);
      if (!rarityOn) return false;
    }

    if (userLocation && Number.isFinite(radiusM)) {
      if (distanceMeters(userLocation, tree.location) > radiusM) return false;
    }

    if (filters.verifiedOnly && tree.pending) return false;
    if (filters.noFenceOnly && tree.fence) return false;
    if (filters.notVisitedOnly && myReports[tree.id]) return false;
    if (filters.inSeasonOnly && species && !isInSeason(species.seasonWindow, now)) return false;

    return true;
  });
}
