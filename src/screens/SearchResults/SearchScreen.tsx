import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing, radii } from '@/theme/spacing';
import { useAppStore } from '@/store';
import { isInSeason } from '@/domain/rules';
import { findSpecies, SPECIES } from '@/server/seedData/species';
import { AppText, Card, Kicker } from '@/components/ui';

const RECENT_SEED = ['fig', 'Via Gola', 'michele-f', 'mulberry'];

export function SearchScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const trees = useAppStore((s) => s.trees);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(RECENT_SEED);

  const allTrees = useMemo(() => Object.values(trees), [trees]);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return null;

    const treeResults = allTrees.filter((t) => {
      const speciesName = findSpecies(t.speciesId)?.name ?? 'Unlisted';
      return (
        speciesName.toLowerCase().includes(q) ||
        t.street.toLowerCase().includes(q) ||
        t.finderHandle.toLowerCase().includes(q)
      );
    });

    const streets = [...new Set(allTrees.map((t) => t.street))].filter((s) =>
      s.toLowerCase().includes(q)
    );

    const foragers = [...new Set(allTrees.map((t) => t.finderHandle))].filter((h) =>
      h.toLowerCase().includes(q)
    );

    return { treeResults, streets, foragers };
  }, [q, allTrees]);

  const ripeThisMonth = useMemo(
    () => SPECIES.filter((s) => isInSeason(s.seasonWindow, new Date())).slice(0, 3),
    []
  );

  const runQuery = (value: string) => {
    setQuery(value);
    const trimmed = value.trim();
    if (trimmed && !recent.includes(trimmed)) {
      setRecent((prev) => [trimmed, ...prev].slice(0, 6));
    }
  };

  const noMatch = results && results.treeResults.length === 0 && results.streets.length === 0 && results.foragers.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingTop: spacing.screenTop, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={10} onPress={() => router.back()}>
            <AppText variant="cardTitle">‹</AppText>
          </Pressable>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: tokens.fuchsia,
              borderRadius: radii.pill,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <TextInput
              value={query}
              onChangeText={runQuery}
              placeholder="Search fruit, street, or forager"
              placeholderTextColor={tokens.dim}
              autoFocus
              style={{ flex: 1, color: tokens.text }}
            />
            {query.length > 0 && (
              <Pressable accessibilityRole="button" accessibilityLabel="Clear" onPress={() => setQuery('')}>
                <AppText variant="cardTitle" dim>
                  ×
                </AppText>
              </Pressable>
            )}
          </View>
        </View>

        {!results ? (
          <>
            <View style={{ gap: 10 }}>
              <Kicker>Recent</Kicker>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {recent.map((r) => (
                  <Pressable
                    key={r}
                    accessibilityRole="button"
                    onPress={() => runQuery(r)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: radii.chip,
                      backgroundColor: tokens.surface2,
                    }}
                  >
                    <AppText variant="rowLabel">{r}</AppText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Kicker>Ripe this month near you</Kicker>
              {ripeThisMonth.map((s) => (
                <View key={s.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText variant="rowLabel">{s.name}</AppText>
                  <AppText variant="microLabel" color={tokens.fuchsia}>
                    +{s.points}
                  </AppText>
                </View>
              ))}
            </View>
          </>
        ) : noMatch ? (
          <Card style={{ gap: 8 }}>
            <AppText variant="cardTitle">{`No "${query.trim()}" on the map yet`}</AppText>
            <AppText variant="body" dim>
              Nothing matches that — species, street, or forager. If you can see one, it is
              worth points.
            </AppText>
            <Pressable accessibilityRole="button" onPress={() => router.push('/add-tree')}>
              <AppText variant="microLabel" color={tokens.fuchsia}>
                ADD IT YOURSELF
              </AppText>
            </Pressable>
          </Card>
        ) : (
          <>
            {results.treeResults.length > 0 && (
              <View style={{ gap: 10 }}>
                <Kicker>{`Trees · ${results.treeResults.length}`}</Kicker>
                {results.treeResults.map((t) => (
                  <Pressable
                    key={t.id}
                    accessibilityRole="button"
                    onPress={() => router.push(`/tree/${t.id}`)}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <View>
                      <AppText variant="rowTitle">{findSpecies(t.speciesId)?.name ?? 'Unlisted'}</AppText>
                      <AppText variant="body" dim>
                        {t.street}
                      </AppText>
                    </View>
                    <AppText variant="microLabel" dim>
                      {t.pending ? 'PENDING' : 'VERIFIED'}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            )}

            {results.streets.length > 0 && (
              <View style={{ gap: 10 }}>
                <Kicker>Streets</Kicker>
                {results.streets.map((street) => {
                  const first = allTrees.find((t) => t.street === street);
                  const count = allTrees.filter((t) => t.street === street).length;
                  return (
                    <Pressable
                      key={street}
                      accessibilityRole="button"
                      onPress={() => first && router.push(`/tree/${first.id}`)}
                      style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                    >
                      <AppText variant="rowLabel">{street}</AppText>
                      <AppText variant="microLabel" dim>
                        {count} TREES
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {results.foragers.length > 0 && (
              <View style={{ gap: 10 }}>
                <Kicker>Foragers</Kicker>
                {results.foragers.map((handle) => {
                  const count = allTrees.filter((t) => t.finderHandle === handle).length;
                  return (
                    <View key={handle} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: tokens.surface2,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AppText variant="microLabel">{handle.charAt(0).toUpperCase()}</AppText>
                      </View>
                      <AppText variant="rowLabel">{handle}</AppText>
                      <AppText variant="microLabel" dim>
                        {count} trees found nearby
                      </AppText>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
