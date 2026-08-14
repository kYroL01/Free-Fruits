import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { AVATARS } from '@/domain/avatars';
import { AppText, Button, Kicker } from '@/components/ui';

export function AvatarPickerModal() {
  const { tokens } = useTheme();
  const closeModal = useAppStore((s) => s.closeModal);
  const avatarId = useAppStore((s) => s.avatarId);
  const setAvatarId = useAppStore((s) => s.setAvatarId);

  return (
    <View style={{ gap: 16 }}>
      <AppText variant="sheetTitle">Choose an avatar</AppText>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View
          style={{
            flex: 1,
            paddingVertical: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: tokens.line,
            alignItems: 'center',
          }}
        >
          <AppText variant="rowLabel">Use a photo</AppText>
        </View>
        <View
          style={{
            flex: 1,
            paddingVertical: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: tokens.line,
            alignItems: 'center',
          }}
        >
          <AppText variant="rowLabel">Initials</AppText>
        </View>
      </View>

      <Kicker>Or pick from nature</Kicker>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {AVATARS.map((a) => {
          const selected = a.id === avatarId;
          return (
            <Pressable
              key={a.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setAvatarId(a.id)}
              style={{
                width: '22%',
                aspectRatio: 1,
                borderRadius: 16,
                backgroundColor: a.tint,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: selected ? 1.5 : 0,
                borderColor: tokens.fuchsia,
              }}
            >
              <AppText style={{ fontSize: 24 }}>{a.emoji}</AppText>
            </Pressable>
          );
        })}
      </View>

      <Button label="Done" onPress={closeModal} />
    </View>
  );
}
