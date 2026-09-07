import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { useAppStore } from '@/store';
import { AppText, Button } from '@/components/ui';
import { AlertRow } from './AlertRow';
import { t } from '@/i18n';

export function AlertsScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const alerts = useAppStore((s) => s.alerts);
  const markAlertRead = useAppStore((s) => s.markAlertRead);
  const markAllAlertsRead = useAppStore((s) => s.markAllAlertsRead);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      contentContainerStyle={{ padding: spacing.screenH, paddingTop: spacing.screenTop, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="screenTitle">{t('alerts.title')}</AppText>
        {alerts.length > 0 && (
          <Pressable accessibilityRole="button" onPress={markAllAlertsRead} hitSlop={8}>
            <AppText variant="microLabel" color={tokens.fuchsia}>
              {t('alerts.markAllRead')}
            </AppText>
          </Pressable>
        )}
      </View>

      {alerts.length === 0 ? (
        <View style={{ gap: 10, paddingTop: 20 }}>
          <AppText variant="cardTitle">{t('alerts.quietForNow')}</AppText>
          <AppText variant="body" dim>
            You will hear about nearby unverified trees, claims that need your input, and trees
            back in season.
          </AppText>
          <Button label={t('alerts.logTreeToStart')} variant="ghost" onPress={() => router.push('/add-tree')} />
        </View>
      ) : (
        alerts.map((alert) => (
          <AlertRow
            key={alert.id}
            alert={alert}
            onPress={() => {
              markAlertRead(alert.id);
              if (alert.treeId) router.push(`/tree/${alert.treeId}`);
            }}
          />
        ))
      )}
    </ScrollView>
  );
}
