import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing } from '@/theme/spacing';
import { AppText } from '@/components/ui';

export function OfflineBanner({ queueCount }: { queueCount: number }) {
  const { tokens } = useTheme();
  const [retried, setRetried] = useState(false);

  return (
    <View style={{ paddingHorizontal: spacing.screenH }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: tokens.goldSoft,
          borderRadius: radii.chip,
          padding: 12,
        }}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="microLabel" color={tokens.gold}>
            OFFLINE · CACHED MAP
          </AppText>
          <AppText variant="body" dim>
            {queueCount} tree{queueCount === 1 ? '' : 's'} waiting to upload
          </AppText>
        </View>
        <Pressable accessibilityRole="button" onPress={() => setRetried(true)} hitSlop={8}>
          <AppText variant="microLabel" color={tokens.gold}>
            {retried ? 'SENT' : 'RETRY'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
