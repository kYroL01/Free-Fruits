import type { LatLng } from '@/domain/types';

const METERS_PER_DEGREE_LAT = 111320;

function metersPerDegreeLng(atLat: number): number {
  return METERS_PER_DEGREE_LAT * Math.cos((atLat * Math.PI) / 180);
}

export type ScreenXY = { x: number; y: number };

/** Flat equirectangular projection — fine at city scale. Origin sits at the viewport centre;
 * +y is down on screen, so increasing latitude (north) moves a point up (negative dy). */
export function project(origin: LatLng, point: LatLng, pxPerMeter: number): ScreenXY {
  const dLat = point.lat - origin.lat;
  const dLng = point.lng - origin.lng;
  const dy = -dLat * METERS_PER_DEGREE_LAT * pxPerMeter;
  const dx = dLng * metersPerDegreeLng(origin.lat) * pxPerMeter;
  return { x: dx, y: dy };
}

/** Inverse of `project` — screen offset from the viewport centre back to a LatLng. */
export function unproject(origin: LatLng, offset: ScreenXY, pxPerMeter: number): LatLng {
  const dyMeters = -offset.y / pxPerMeter;
  const dxMeters = offset.x / pxPerMeter;
  const dLat = dyMeters / METERS_PER_DEGREE_LAT;
  const dLng = dxMeters / metersPerDegreeLng(origin.lat);
  return { lat: origin.lat + dLat, lng: origin.lng + dLng };
}

export function metersToPoint(origin: LatLng, point: LatLng): { dxMeters: number; dyMeters: number } {
  const dLat = point.lat - origin.lat;
  const dLng = point.lng - origin.lng;
  return {
    dxMeters: dLng * metersPerDegreeLng(origin.lat),
    dyMeters: -dLat * METERS_PER_DEGREE_LAT,
  };
}
