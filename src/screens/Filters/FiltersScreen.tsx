import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { useAppStore } from '@/store';
import { useLocation } from '@/hooks/useLocation';
import { filterTrees } from '@/domain/rules';
import { findSpecies } from '@/server/seedData/species';
import { AppText, Button, Chip, Kicker, Switch } from '@/components/ui';
import { DistanceStepper } from './DistanceStepper';
import { t } from '@/i18n';

export function FiltersScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { coords } = useLocation();

  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const resetFilters = useAppStore((s) => s.resetFilters);
  const trees = useAppStore((s) => s.trees);
  const myReports = useAppStore((s) => s.myReports);

  const allTrees = useMemo(() => Object.values(trees), [trees]);
  const fruitCount = useMemo(
    () => allTrees.filter((t) => findSpecies(t.speciesId)?.kind === 'fruit').length,
    [allTrees]
  );
  const herbCount = allTrees.length - fruitCount;

  const filteredCount = useMemo(
    () =>
      filterTrees({
        trees: allTrees,
        filters,
        userLocation: coords,
        myReports,
        speciesLookup: findSpecies,
        now: new Date(),
      }).length,
    [allTrees, filters, coords, myReports]
  );

  const footerLabel =
    filteredCount === 0
      ? t('filters.nothingMatches')
      : filteredCount === allTrees.length
        ? `Show all ${filteredCount} results`
        : `Show ${filteredCount} results`;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingTop: spacing.screenTop, gap: 20, paddingBottom: 100 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('common.close')} hitSlop={10} onPress={() => router.back()}>
            <AppText variant="cardTitle">×</AppText>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={resetFilters}>
            <AppText variant="microLabel" color={tokens.fuchsia}>
              {t('filters.reset')}
            </AppText>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="search"
          onPress={() => router.push('/search')}
          style={{
            borderWidth: 1,
            borderColor: tokens.line,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <AppText variant="body" dim>
            {t('filters.searchPlaceholder')}
          </AppText>
        </Pressable>

        <View style={{ gap: 10 }}>
          <Kicker>{t('filters.whatToShow')}</Kicker>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip
              label={t('filters.fruitTrees')}
              count={fruitCount}
              active={filters.kinds.fruit}
              onPress={() => setFilters({ kinds: { ...filters.kinds, fruit: !filters.kinds.fruit } })}
            />
            <Chip
              label={t('filters.herbsAndGreens')}
              count={herbCount}
              active={filters.kinds.herb}
              onPress={() => setFilters({ kinds: { ...filters.kinds, herb: !filters.kinds.herb } })}
            />
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Kicker>{t('filters.rarity')}</Kicker>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip
              label={t('filters.rarityCommon')}
              activeColor={tokens.green}
              active={filters.rarity.common}
              onPress={() => setFilters({ rarity: { ...filters.rarity, common: !filters.rarity.common } })}
            />
            <Chip
              label={t('filters.rarityRare')}
              activeColor={tokens.fuchsia}
              active={filters.rarity.rare}
              onPress={() => setFilters({ rarity: { ...filters.rarity, rare: !filters.rarity.rare } })}
            />
            <Chip
              label={t('filters.rarityLegendary')}
              activeColor={tokens.gold}
              active={filters.rarity.legendary}
              onPress={() => setFilters({ rarity: { ...filters.rarity, legendary: !filters.rarity.legendary } })}
            />
          </View>
        </View>

        <DistanceStepper step={filters.radiusStep} onChange={(radiusStep) => setFilters({ radiusStep })} />

        <View style={{ gap: 14 }}>
          <Kicker>{t('filters.onlyShow')}</Kicker>
          {(
            [
              ['verifiedOnly', 'Verified trees only'],
              ['inSeasonOnly', 'In season right now'],
              ['noFenceOnly', 'Reachable without a fence'],
              ['notVisitedOnly', 'Trees I have not visited'],
            ] as const
          ).map(([key, label]) => (
            <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppText variant="rowLabel">{label}</AppText>
              <Switch
                value={filters[key]}
                onValueChange={(value) => setFilters({ [key]: value })}
                accessibilityLabel={label}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: spacing.screenH, right: spacing.screenH, bottom: 20 }}>
        <Button label={footerLabel} disabled={filteredCount === 0} onPress={() => router.back()} />
      </View>
    </View>
  );
}
