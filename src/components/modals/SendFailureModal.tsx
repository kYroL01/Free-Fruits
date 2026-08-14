import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { AppText, Button, Card, IconTile, Kicker } from '@/components/ui';

export function SendFailureModal({ onRetry, onLater }: { onRetry: () => void; onLater: () => void }) {
  const { tokens } = useTheme();
  const closeModal = useAppStore((s) => s.closeModal);

  return (
    <View style={{ gap: 16 }}>
      <IconTile tint={tokens.goldSoft} size={44} radius={14}>
        <AppText variant="cardTitle" color={tokens.gold}>
          !
        </AppText>
      </IconTile>
      <Kicker>Couldn&apos;t reach the map</Kicker>
      <AppText variant="sheetTitle">The tree is safe on your phone</AppText>
      <AppText variant="body" dim>
        The photo, GPS stamp, and species are held on your device and will upload the moment you
        have signal again.
      </AppText>
      <Card tint={tokens.surface2} elevated={false} style={{ padding: 12 }}>
        <AppText variant="body" dim>
          Points stay pending either way — two on-site confirmations still decide.
        </AppText>
      </Card>
      <Button
        label="Try again now"
        variant="dark"
        onPress={() => {
          closeModal();
          onRetry();
        }}
      />
      <Button
        label="Upload it later"
        variant="ghost"
        onPress={() => {
          closeModal();
          onLater();
        }}
      />
    </View>
  );
}
