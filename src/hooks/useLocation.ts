import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

import { useAppStore } from '@/store';
import type { LatLng, PermissionStatus } from '@/domain/types';

export type LocationState = {
  coords: LatLng | null;
  accuracyM: number | null;
  status: PermissionStatus;
  loading: boolean;
};

/** Live GPS position — deliberately NOT persisted anywhere (the privacy screen promises "your
 * live position — never stored"). Requests foreground permission on mount; a prior denial is
 * reflected instantly without re-prompting. */
export function useLocation(): LocationState {
  const setPermission = useAppStore((s) => s.setPermission);
  const status = useAppStore((s) => s.permissions.location);
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [accuracyM, setAccuracyM] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
      if (!mounted) return;
      setPermission('location', permStatus === 'granted' ? 'granted' : 'denied');

      if (permStatus !== 'granted') {
        setLoading(false);
        return;
      }

      const last = await Location.getLastKnownPositionAsync();
      if (mounted && last) {
        setCoords({ lat: last.coords.latitude, lng: last.coords.longitude });
        setAccuracyM(last.coords.accuracy ?? null);
      }

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 10 },
        (loc) => {
          if (mounted) {
            setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
            setAccuracyM(loc.coords.accuracy ?? null);
          }
        }
      );

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [setPermission]);

  return { coords, accuracyM, status, loading };
}
