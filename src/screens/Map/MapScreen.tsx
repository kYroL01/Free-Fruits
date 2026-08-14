import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStore } from '@/store';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { useLocation } from '@/hooks/useLocation';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { CITY_LABEL, CITY_CENTER } from '@/domain/constants';
import { DISTANCE_STEPS_M } from '@/domain/types';
import { distanceMeters, filterTrees } from '@/domain/rules';
import { findSpecies } from '@/server/seedData/species';
import { formatDistance } from '@/utils/formatDistance';
import type { MapMarker } from '@/components/map/MapCanvas';
import { MapCanvas } from '@/components/map/MapCanvas';
import { MapHeader, type LocationBarState } from './MapHeader';
import { ProximityPromptCard } from './ProximityPromptCard';
import { ResultsCarousel } from './ResultsCarousel';
import { EmptyMapCard } from './EmptyMapCard';
import { LocationOffBanner } from './LocationOffBanner';
import { OfflineBanner } from './OfflineBanner';
import { SkeletonCarousel } from './SkeletonCarousel';

const PROXIMITY_RADIUS_M = 12;

function speciesInitial(speciesId: string): string {
  return (findSpecies(speciesId)?.name ?? speciesId).charAt(0).toUpperCase();
}

function radiusLabel(step: 0 | 1 | 2 | 3 | 4): string {
  const m = DISTANCE_STEPS_M[step];
  if (!Number.isFinite(m)) return 'the city';
  if (m >= 1000) return `${m / 1000} km`;
  return `${m} m`;
}

export function MapScreen() {
  const router = useRouter();
  const { tokens, dark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { coords, status } = useLocation();
  const { isConnected } = useNetworkStatus();

  const treesById = useAppStore((s) => s.trees);
  const queue = useAppStore((s) => s.queue);
  const filters = useAppStore((s) => s.filters);
  const myReports = useAppStore((s) => s.myReports);
  const units = useAppStore((s) => s.units);
  const userId = useAppStore((s) => s.userId);

  const [dismissedProximity, setDismissedProximity] = useState<Set<string>>(new Set());

  const allTrees = useMemo(() => Object.values(treesById), [treesById]);

  const filtered = useMemo(
    () =>
      filterTrees({
        trees: allTrees,
        filters,
        userLocation: coords,
        myReports,
        speciesLookup: findSpecies,
        now: new Date(),
      }),
    [allTrees, filters, coords, myReports]
  );

  const sorted = useMemo(() => {
    if (!coords) return filtered;
    return [...filtered].sort(
      (a, b) => distanceMeters(coords, a.location) - distanceMeters(coords, b.location)
    );
  }, [filtered, coords]);

  const markers: MapMarker[] = useMemo(
    () =>
      filtered.map((t) => ({
        id: t.id,
        location: t.location,
        rarity: t.rarity,
        initial: speciesInitial(t.speciesId),
        label: findSpecies(t.speciesId)?.name ?? 'Unlisted tree',
      })),
    [filtered]
  );

  const proximityTarget = useMemo(() => {
    if (!coords) return null;
    return (
      sorted.find(
        (t) =>
          t.pending &&
          t.finderId !== userId &&
          !dismissedProximity.has(t.id) &&
          distanceMeters(coords, t.location) <= PROXIMITY_RADIUS_M
      ) ?? null
    );
  }, [coords, sorted, dismissedProximity, userId]);

  const locationBarState: LocationBarState =
    status === 'denied' ? 'off' : coords ? 'ok' : 'locating';

  const filtersConstrained =
    filters.kinds.fruit ||
    filters.kinds.herb ||
    filters.rarity.common ||
    filters.rarity.rare ||
    filters.rarity.legendary ||
    filters.verifiedOnly ||
    filters.inSeasonOnly ||
    filters.noFenceOnly ||
    filters.notVisitedOnly ||
    filters.radiusStep < 4;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <MapCanvas
        center={coords ?? CITY_CENTER}
        markers={markers}
        userLocation={coords}
        onMarkerPress={(id) => router.push(`/tree/${id}`)}
      />

      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top + 10,
          paddingHorizontal: spacing.screenH,
          gap: 12,
        }}
      >
        <MapHeader
          cityLabel={CITY_LABEL}
          state={locationBarState}
          onFilterPress={() => router.push('/filters')}
          dark={dark}
          onToggleTheme={toggleTheme}
        />

        {proximityTarget && (
          <ProximityPromptCard
            distanceM={coords ? distanceMeters(coords, proximityTarget.location) : 0}
            speciesName={findSpecies(proximityTarget.speciesId)?.name ?? 'tree'}
            onConfirm={() => router.push(`/tree/${proximityTarget.id}?openReport=1`)}
            onDismiss={() =>
              setDismissedProximity((prev) => new Set(prev).add(proximityTarget.id))
            }
          />
        )}
      </View>

      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 20, gap: 12 }}
      >
        {locationBarState === 'off' && (
          <LocationOffBanner cityLabel={CITY_LABEL} onTurnOn={() => router.push('/onboarding')} />
        )}

        {!isConnected && queue.length > 0 && <OfflineBanner queueCount={queue.length} />}

        {locationBarState === 'locating' ? (
          <SkeletonCarousel />
        ) : filtered.length === 0 ? (
          allTrees.length === 0 ? (
            <EmptyMapCard variant="nothing_mapped" onAddFirst={() => router.push('/add-tree')} />
          ) : filtersConstrained ? (
            <EmptyMapCard variant="filtered_empty" onLoosen={() => router.push('/filters')} />
          ) : null
        ) : (
          <ResultsCarousel
            trees={sorted}
            radiusLabel={radiusLabel(filters.radiusStep)}
            speciesName={(id) => findSpecies(id)?.name ?? 'Unlisted'}
            distanceLabel={(t) => (coords ? formatDistance(distanceMeters(coords, t.location), units) : '—')}
            onSeeAll={() => router.push('/filters')}
            onTreePress={(id) => router.push(`/tree/${id}`)}
          />
        )}
      </View>
    </View>
  );
}
