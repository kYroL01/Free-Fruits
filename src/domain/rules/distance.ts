import type { LatLng } from '../types';

const EARTH_RADIUS_M = 6371000;

/** Great-circle distance in metres. */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_M * c;
}

/** Photo-GPS-to-pin proof radius: within ~3m proves the photo was taken at the pin. */
export const PROOF_RADIUS_M = 3;

/** Check-ins only unlock within 25m of a tree's pin. */
export const CHECKIN_RADIUS_M = 25;

/** A new pin within 8m of an existing tree forces the duplicate flow. */
export const DUPLICATE_RADIUS_M = 8;

export function isWithinProofRadius(photoGps: LatLng, pin: LatLng): boolean {
  return distanceMeters(photoGps, pin) <= PROOF_RADIUS_M;
}

export function isWithinCheckinRadius(userLocation: LatLng, pin: LatLng): boolean {
  return distanceMeters(userLocation, pin) <= CHECKIN_RADIUS_M;
}
