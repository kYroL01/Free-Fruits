import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import type { QueueItem } from '@/domain/types';
import { findSpecies } from '@/server/seedData/species';
import { AppText } from '@/components/ui';

function minutesAgo(iso: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

export function WaitingToUploadRow({ item }: { item: QueueItem }) {
  const { tokens } = useTheme();
  const [retried, setRetried] = useState(false);
  const speciesName = findSpecies(item.speciesId)?.name ?? 'Unlisted tree';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: tokens.gold,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="rowTitle">{speciesName}</AppText>
        <AppText variant="body" dim>
          Photo and GPS stamp saved {minutesAgo(item.takenAt)} min ago. Uploads by itself when
          you have signal.
        </AppText>
      </View>
      <Pressable accessibilityRole="button" onPress={() => setRetried(true)} hitSlop={8}>
        <AppText variant="microLabel" color={tokens.gold}>
          {retried ? 'SENT' : 'RETRY'}
        </AppText>
      </Pressable>
    </View>
  );
}
