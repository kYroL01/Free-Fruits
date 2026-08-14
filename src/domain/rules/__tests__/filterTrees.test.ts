import { filterTrees } from '../filterTrees';
import { makeTree } from '../testFixtures';
import type { Filters, Species } from '../../types';

const NOW = new Date(2026, 5, 15);

const ORANGE: Species = { id: 'orange', name: 'Orange', kind: 'fruit', rarity: 'common', points: 10, seasonWindow: [10, 2] };
const SAGE: Species = { id: 'sage', name: 'Sage', kind: 'herb', rarity: 'rare', points: 25, seasonWindow: [2, 7] };

function speciesLookup(id: string): Species | null {
  return [ORANGE, SAGE].find((s) => s.id === id) ?? null;
}

const baseFilters: Filters = {
  kinds: { fruit: false, herb: false },
  rarity: { common: false, rare: false, legendary: false },
  radiusStep: 4,
  verifiedOnly: false,
  inSeasonOnly: false,
  noFenceOnly: false,
  notVisitedOnly: false,
};

describe('filterTrees', () => {
  const orangeTree = makeTree({ id: 'orange-tree', speciesId: 'orange', rarity: 'common' });
  const sageTree = makeTree({ id: 'sage-tree', speciesId: 'sage', rarity: 'rare' });
  const trees = [orangeTree, sageTree];

  it('all-off chip groups apply no constraint — never blanks the map', () => {
    const result = filterTrees({
      trees,
      filters: baseFilters,
      userLocation: null,
      myReports: {},
      speciesLookup,
      now: NOW,
    });
    expect(result.map((t) => t.id).sort()).toEqual(['orange-tree', 'sage-tree']);
  });

  it('kind filter includes only the toggled-on kind', () => {
    const result = filterTrees({
      trees,
      filters: { ...baseFilters, kinds: { fruit: true, herb: false } },
      userLocation: null,
      myReports: {},
      speciesLookup,
      now: NOW,
    });
    expect(result.map((t) => t.id)).toEqual(['orange-tree']);
  });

  it('rarity filter includes only toggled-on rarities', () => {
    const result = filterTrees({
      trees,
      filters: { ...baseFilters, rarity: { common: false, rare: true, legendary: false } },
      userLocation: null,
      myReports: {},
      speciesLookup,
      now: NOW,
    });
    expect(result.map((t) => t.id)).toEqual(['sage-tree']);
  });

  it('verifiedOnly excludes pending trees', () => {
    const verified = makeTree({ id: 'verified', pending: false });
    const pending = makeTree({ id: 'pending', pending: true });
    const result = filterTrees({
      trees: [verified, pending],
      filters: { ...baseFilters, verifiedOnly: true },
      userLocation: null,
      myReports: {},
      speciesLookup,
      now: NOW,
    });
    expect(result.map((t) => t.id)).toEqual(['verified']);
  });

  it('noFenceOnly excludes fenced trees', () => {
    const open = makeTree({ id: 'open', fence: false });
    const fenced = makeTree({ id: 'fenced', fence: true });
    const result = filterTrees({
      trees: [open, fenced],
      filters: { ...baseFilters, noFenceOnly: true },
      userLocation: null,
      myReports: {},
      speciesLookup,
      now: NOW,
    });
    expect(result.map((t) => t.id)).toEqual(['open']);
  });

  it('notVisitedOnly excludes trees the user has already reported on', () => {
    const visited = makeTree({ id: 'visited' });
    const unvisited = makeTree({ id: 'unvisited' });
    const result = filterTrees({
      trees: [visited, unvisited],
      filters: { ...baseFilters, notVisitedOnly: true },
      userLocation: null,
      myReports: { visited: { treeId: 'visited', kind: 'good', reason: 'fruit_ready', at: NOW.toISOString() } },
      speciesLookup,
      now: NOW,
    });
    expect(result.map((t) => t.id)).toEqual(['unvisited']);
  });

  it('inSeasonOnly filters by the species season window at `now`', () => {
    // June: orange (Nov-Mar) is out, sage (Mar-Aug) is in.
    const result = filterTrees({
      trees,
      filters: { ...baseFilters, inSeasonOnly: true },
      userLocation: null,
      myReports: {},
      speciesLookup,
      now: NOW,
    });
    expect(result.map((t) => t.id)).toEqual(['sage-tree']);
  });

  it('radius filter excludes trees beyond the selected step when location is known', () => {
    const near = makeTree({ id: 'near', location: { lat: 39.4699, lng: -0.3763 } });
    const far = makeTree({ id: 'far', location: { lat: 39.55, lng: -0.3763 } }); // ~9km away
    const result = filterTrees({
      trees: [near, far],
      filters: { ...baseFilters, radiusStep: 0 }, // 300m
      userLocation: { lat: 39.4699, lng: -0.3763 },
      myReports: {},
      speciesLookup,
      now: NOW,
    });
    expect(result.map((t) => t.id)).toEqual(['near']);
  });

  it('radius filter is skipped entirely when user location is unknown', () => {
    const far = makeTree({ id: 'far', location: { lat: 39.55, lng: -0.3763 } });
    const result = filterTrees({
      trees: [far],
      filters: { ...baseFilters, radiusStep: 0 },
      userLocation: null,
      myReports: {},
      speciesLookup,
      now: NOW,
    });
    expect(result.map((t) => t.id)).toEqual(['far']);
  });
});
