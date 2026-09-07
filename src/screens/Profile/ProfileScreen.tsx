import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing } from '@/theme/spacing';
import { useAppStore } from '@/store';
import { TIER_THRESHOLDS, tierProgress } from '@/domain/rules';
import { findAvatar } from '@/domain/avatars';
import { findSpecies } from '@/server/seedData/species';
import { CITY_LABEL } from '@/domain/constants';
import { AppText, AvatarGlyph, BarProgress, Card, Kicker, Switch } from '@/components/ui';
import { MyTreeRow } from './MyTreeRow';
import { WaitingToUploadRow } from './WaitingToUploadRow';

export function ProfileScreen() {
  const { tokens } = useTheme();
  const router = useRouter();

  const displayName = useAppStore((s) => s.displayName);
  const setDisplayName = useAppStore((s) => s.setDisplayName);
  const handle = useAppStore((s) => s.handle);
  const avatarId = useAppStore((s) => s.avatarId);
  const points = useAppStore((s) => s.points);
  const userId = useAppStore((s) => s.userId);
  const trees = useAppStore((s) => s.trees);
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const units = useAppStore((s) => s.units);
  const setUnits = useAppStore((s) => s.setUnits);
  const openModal = useAppStore((s) => s.openModal);
  const queue = useAppStore((s) => s.queue);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);

  const avatar = findAvatar(avatarId);
  const progress = tierProgress(points);

  const myTrees = useMemo(
    () => Object.values(trees).filter((t) => t.finderId === userId),
    [trees, userId]
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      contentContainerStyle={{ padding: spacing.screenH, paddingTop: spacing.screenTop, gap: 20 }}
    >
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change avatar"
          onPress={() => openModal({ type: 'avatar_picker' })}
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            backgroundColor: tokens.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AvatarGlyph avatar={avatar} size={52} />
          <View
            style={{
              position: 'absolute',
              right: -4,
              bottom: -4,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: tokens.fuchsia,
              borderWidth: 2,
              borderColor: tokens.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="microLabel" color="#FFFFFF">
              +
            </AppText>
          </View>
        </Pressable>

        <View style={{ flex: 1, gap: 4 }}>
          {editingName ? (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <TextInput
                value={nameDraft}
                onChangeText={setNameDraft}
                autoFocus
                style={{
                  flex: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: tokens.fuchsia,
                  paddingVertical: 2,
                  color: tokens.text,
                  fontFamily: 'Archivo_700Bold',
                  fontSize: 18,
                }}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setDisplayName(nameDraft.trim() || displayName);
                  setEditingName(false);
                }}
              >
                <AppText variant="microLabel" color={tokens.fuchsia}>
                  SAVE
                </AppText>
              </Pressable>
            </View>
          ) : (
            <Pressable accessibilityRole="button" onPress={() => setEditingName(true)}>
              <AppText variant="screenTitle" style={{ fontSize: 20 }}>
                {displayName}
              </AppText>
            </Pressable>
          )}
          <AppText variant="body" dim>
            @{handle} · {CITY_LABEL} · since 2025
          </AppText>
        </View>
      </View>

      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="cardTitle">{progress.tier[0].toUpperCase() + progress.tier.slice(1)}</AppText>
          <AppText variant="body" dim>
            {points.toLocaleString()}
            {progress.nextTier ? ` / ${TIER_THRESHOLDS[progress.nextTier].toLocaleString()}` : ''}
          </AppText>
        </View>
        <BarProgress progress={progress.progress} gradientColors={[tokens.green, tokens.fuchsia]} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="microLabel" dim>
            SPROUT
          </AppText>
          <AppText variant="microLabel" dim>
            ORCHARDIST
          </AppText>
        </View>
      </Card>

      {queue.length > 0 && (
        <View style={{ gap: 10 }}>
          <Kicker>{`Waiting to upload · ${queue.length}`}</Kicker>
          {queue.map((item) => (
            <WaitingToUploadRow key={item.id} item={item} />
          ))}
        </View>
      )}

      <View style={{ gap: 10 }}>
        <Kicker>{`My trees · ${myTrees.length}`}</Kicker>
        {myTrees.length === 0 ? (
          <Card style={{ borderWidth: 1, borderColor: tokens.line, borderStyle: 'dashed' }} elevated={false}>
            <AppText variant="body" dim>
              No trees yet. Discovery credit is permanent and yours forever — log your first
              tree.
            </AppText>
          </Card>
        ) : (
          myTrees.map((t) => (
            <MyTreeRow
              key={t.id}
              tree={t}
              speciesName={findSpecies(t.speciesId)?.name ?? 'Unlisted'}
              onPress={() => router.push(`/tree/${t.id}`)}
            />
          ))
        )}
      </View>

      <View style={{ gap: 4 }}>
        <Kicker>Settings</Kicker>
        <Card style={{ gap: 0, padding: 0, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 }}>
            <AppText variant="rowLabel">Dark mode</AppText>
            <Switch value={darkMode} onValueChange={toggleDarkMode} accessibilityLabel="Dark mode" />
          </View>
          <View style={{ height: 1, backgroundColor: tokens.line }} />
          <Pressable
            accessibilityRole="button"
            onPress={() => openModal({ type: 'invite_link' })}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 }}
          >
            <AppText variant="rowLabel">Invite a forager</AppText>
            <AppText variant="microLabel" dim>
              ›
            </AppText>
          </Pressable>
          <View style={{ height: 1, backgroundColor: tokens.line }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 }}>
            <AppText variant="rowLabel">Units</AppText>
            <View style={{ flexDirection: 'row', backgroundColor: tokens.surface2, borderRadius: radii.pill, padding: 3 }}>
              {(['metric', 'imperial'] as const).map((u) => (
                <Pressable
                  key={u}
                  accessibilityRole="button"
                  onPress={() => setUnits(u)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: radii.pill,
                    backgroundColor: units === u ? tokens.surface : 'transparent',
                  }}
                >
                  <AppText variant="microLabel">{u === 'metric' ? 'METRIC' : 'IMPERIAL'}</AppText>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: tokens.line }} />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/privacy')}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 }}
          >
            <AppText variant="rowLabel">Privacy & my location history</AppText>
            <AppText variant="microLabel" dim>
              ›
            </AppText>
          </Pressable>
        </Card>
      </View>
    </ScrollView>
  );
}
