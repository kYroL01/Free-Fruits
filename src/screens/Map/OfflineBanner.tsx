import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing } from '@/theme/spacing';
import { AppText } from '@/components/ui';
import { t } from '@/i18n';

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
            {t('map.offlineCachedMap')}
          </AppText>
          <AppText variant="body" dim>
            {t('map.waitingToUpload', { count: queueCount })}
          </AppText>
        </View>
        <Pressable accessibilityRole="button" onPress={() => setRetried(true)} hitSlop={8}>
          <AppText variant="microLabel" color={tokens.gold}>
            {retried ? t('common.sent') : t('common.retry')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
