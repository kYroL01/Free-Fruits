import {
  CHECKIN_RADIUS_M,
  DUPLICATE_RADIUS_M,
  PROOF_RADIUS_M,
  distanceMeters,
  isWithinCheckinRadius,
  isWithinProofRadius,
} from '../distance';

const ORIGIN = { lat: 39.4699, lng: -0.3763 };

// ~1 degree latitude ≈ 111.32km, so 0.00001 lat ≈ 1.1132m — a convenient small-step unit for
// these tests.
function metersNorth(m: number) {
  return { lat: ORIGIN.lat + m / 111320, lng: ORIGIN.lng };
}

describe('distance', () => {
  it('returns 0 for identical points', () => {
    expect(distanceMeters(ORIGIN, ORIGIN)).toBe(0);
  });

  it('proof radius accepts within 3m and rejects beyond it', () => {
    expect(isWithinProofRadius(metersNorth(2), ORIGIN)).toBe(true);
    expect(isWithinProofRadius(metersNorth(PROOF_RADIUS_M), ORIGIN)).toBe(true);
    expect(isWithinProofRadius(metersNorth(4), ORIGIN)).toBe(false);
  });

  it('checkin radius accepts within 25m and rejects beyond it', () => {
    expect(isWithinCheckinRadius(metersNorth(24), ORIGIN)).toBe(true);
    expect(isWithinCheckinRadius(metersNorth(CHECKIN_RADIUS_M), ORIGIN)).toBe(true);
    expect(isWithinCheckinRadius(metersNorth(26), ORIGIN)).toBe(false);
  });

  it('duplicate radius constant is 8m', () => {
    expect(DUPLICATE_RADIUS_M).toBe(8);
  });
});
