import type { LatLng } from './types';

/** Placeholder city centre for the mock-data build — meant to eventually derive from real
 * geolocation rather than being hardcoded. Valencia, not Milan (the original design spec's
 * example city): the user is based here. */
export const CITY_LABEL = 'Valencia';
export const CITY_CENTER: LatLng = { lat: 39.4699, lng: -0.3763 };
