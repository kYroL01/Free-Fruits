/** Distances under 1km stay in metres regardless of the user's units setting (spec: "Distances
 * under 1 km stay in metres"). */
export function formatDistance(meters: number, units: 'metric' | 'imperial' = 'metric'): string {
  if (units === 'imperial') {
    const feet = meters * 3.28084;
    if (feet < 1000) return `${Math.round(feet)} ft`;
    return `${(feet / 5280).toFixed(1)} mi`;
  }
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
