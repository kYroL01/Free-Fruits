import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { AppText, Button, IconTile } from '@/components/ui';

export function NoLocationModal() {
  const { tokens } = useTheme();
  const router = useRouter();
  const closeModal = useAppStore((s) => s.closeModal);

  return (
    <View style={{ gap: 16 }}>
      <IconTile tint={tokens.goldSoft} size={44} radius={14}>
        <AppText variant="cardTitle" color={tokens.gold}>
          !
        </AppText>
      </IconTile>
      <AppText variant="sheetTitle">This photo has no location in it</AppText>
      <AppText variant="body" dim>
        A tree only counts as proof when its photo carries a GPS stamp. Take a new photo on
        site instead of picking one from your library.
      </AppText>
      <Button label="Open camera" variant="dark" onPress={closeModal} />
      <Button
        label="Later"
        variant="ghost"
        onPress={() => {
          closeModal();
          router.back();
        }}
      />
    </View>
  );
}
