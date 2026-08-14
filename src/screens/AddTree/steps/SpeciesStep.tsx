import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { rarityColor } from '@/theme/tokens';
import { radii } from '@/theme/spacing';
import { SPECIES } from '@/server/seedData/species';
import type { LatLng, Species, SpeciesKind } from '@/domain/types';
import { AppText, Button, Card } from '@/components/ui';

export type SpeciesPick = { species: Species | null; unlistedName: string | null };

type SpeciesStepProps = {
  photoUri: string;
  location: LatLng;
  onConfirm: (pick: SpeciesPick) => void;
};

const AUTO_MATCH = SPECIES.find((s) => s.id === 'fig')!;

export function SpeciesStep({ photoUri, location, onConfirm }: SpeciesStepProps) {
  const { tokens } = useTheme();
  const [kind, setKind] = useState<SpeciesKind>('fruit');
  const [selected, setSelected] = useState<Species | null>(null);
  const [autoUsed, setAutoUsed] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [freeTextUsed, setFreeTextUsed] = useState(false);

  const grid = useMemo(() => SPECIES.filter((s) => s.kind === kind), [kind]);

  const pickSpecies = (s: Species) => {
    setSelected(s);
    setFreeTextUsed(false);
  };

  const useFreeText = () => {
    if (!freeText.trim()) return;
    setFreeTextUsed(true);
    setSelected(null);
  };

  const canConfirm = !!selected || freeTextUsed;
  const footerLabel = selected
    ? `Confirm ${selected.name} · +${selected.points}`
    : freeTextUsed
      ? `Confirm ${freeText.trim()} · +15`
      : 'Pick a species first';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ gap: 18, paddingBottom: 100 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Image source={{ uri: photoUri }} style={{ width: 72, height: 72, borderRadius: 12 }} />
          <AppText variant="body" dim>
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </AppText>
        </View>

        <Card tint={tokens.fuchsiaSoft} elevated={false} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <AppText variant="cardTitle">{AUTO_MATCH.name} — 92% match</AppText>
            <AppText variant="body" dim>
              {AUTO_MATCH.rarity} · worth {AUTO_MATCH.points} points
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setKind(AUTO_MATCH.kind);
              pickSpecies(AUTO_MATCH);
              setAutoUsed(true);
            }}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: radii.chip,
              backgroundColor: tokens.fuchsia,
            }}
          >
            <AppText variant="microLabel" color="#FFFFFF">
              {autoUsed && selected?.id === AUTO_MATCH.id ? 'SELECTED' : 'USE'}
            </AppText>
          </Pressable>
        </Card>

        <View style={{ flexDirection: 'row', backgroundColor: tokens.surface2, borderRadius: radii.pill, padding: 4 }}>
          {(['fruit', 'herb'] as const).map((k) => (
            <Pressable
              key={k}
              accessibilityRole="button"
              onPress={() => setKind(k)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: radii.pill,
                alignItems: 'center',
                backgroundColor: kind === k ? tokens.surface : 'transparent',
              }}
            >
              <AppText variant="rowLabel">{k === 'fruit' ? 'Fruit tree' : 'Herb or green'}</AppText>
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {grid.map((s) => {
            const isSelected = selected?.id === s.id;
            return (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => pickSpecies(s)}
                style={{
                  width: '31%',
                  borderRadius: 12,
                  borderWidth: isSelected ? 1.5 : 1,
                  borderColor: isSelected ? tokens.fuchsia : tokens.line,
                  padding: 10,
                  gap: 6,
                  alignItems: 'center',
                }}
              >
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: rarityColor(tokens, s.rarity) }} />
                <AppText variant="rowLabel" style={{ textAlign: 'center' }}>
                  {s.name}
                </AppText>
                <AppText variant="microLabel" color={tokens.fuchsia}>
                  +{s.points}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={{ gap: 8 }}>
          <AppText variant="sectionKicker">None of these?</AppText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={freeText}
              onChangeText={(t) => {
                setFreeText(t);
                setFreeTextUsed(false);
              }}
              placeholder="Type the species"
              placeholderTextColor={tokens.dim}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: tokens.line,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: tokens.text,
              }}
            />
            <Pressable
              accessibilityRole="button"
              onPress={useFreeText}
              style={{
                paddingHorizontal: 16,
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: tokens.surface2,
              }}
            >
              <AppText variant="rowLabel">Use</AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <Button
          label={footerLabel}
          disabled={!canConfirm}
          onPress={() => onConfirm({ species: selected, unlistedName: freeTextUsed ? freeText.trim() : null })}
        />
      </View>
    </View>
  );
}
