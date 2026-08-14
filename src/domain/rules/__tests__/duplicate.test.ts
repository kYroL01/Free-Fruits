import { findDuplicateCandidate } from '../duplicate';
import { makeTree } from '../testFixtures';

const ORIGIN = { lat: 39.4699, lng: -0.3763 };

function metersEast(m: number) {
  const metersPerDegreeLng = 111320 * Math.cos((ORIGIN.lat * Math.PI) / 180);
  return { lat: ORIGIN.lat, lng: ORIGIN.lng + m / metersPerDegreeLng };
}

describe('duplicate detection', () => {
  it('returns null when no trees are nearby', () => {
    expect(findDuplicateCandidate(ORIGIN, [])).toBeNull();
  });

  it('flags a pin within 8m as a duplicate candidate', () => {
    const tree = makeTree({ location: metersEast(5) });
    expect(findDuplicateCandidate(ORIGIN, [tree])?.id).toBe(tree.id);
  });

  it('does not flag a pin just beyond 8m', () => {
    const tree = makeTree({ location: metersEast(9) });
    expect(findDuplicateCandidate(ORIGIN, [tree])).toBeNull();
  });

  it('returns the nearest candidate when multiple trees are within range', () => {
    const near = makeTree({ id: 'near', location: metersEast(2) });
    const far = makeTree({ id: 'far', location: metersEast(7) });
    expect(findDuplicateCandidate(ORIGIN, [far, near])?.id).toBe('near');
  });
});
