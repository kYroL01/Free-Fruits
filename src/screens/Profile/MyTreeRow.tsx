import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { Tree } from '@/domain/types';
import { AppText } from '@/components/ui';

export function MyTreeRow({ tree, speciesName, onPress }: { tree: Tree; speciesName: string; onPress: () => void }) {
  const { tokens } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: tokens.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppText variant="rowTitle">{speciesName.charAt(0).toUpperCase()}</AppText>
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="rowTitle">{speciesName}</AppText>
        <AppText variant="body" dim>
          {tree.street}
        </AppText>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <AppText variant="microLabel" color={tree.pending ? tokens.fuchsia : tokens.green}>
          {tree.pending ? `PENDING ${tree.confirmations}/${tree.confirmationsNeeded}` : 'VERIFIED'}
        </AppText>
        <AppText variant="microLabel" dim>
          +{tree.points}
        </AppText>
      </View>
    </Pressable>
  );
}
