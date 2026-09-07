import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { AVATARS } from '@/domain/avatars';
import { AppText, AvatarGlyph, Button, Kicker } from '@/components/ui';

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
              accessibilityLabel={a.label}
              onPress={() => setAvatarId(a.id)}
              style={{
                width: '22%',
                borderRadius: 14,
                paddingVertical: 10,
                backgroundColor: tokens.surface,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                borderWidth: 1.5,
                borderColor: selected ? tokens.fuchsia : tokens.line,
              }}
            >
              <AvatarGlyph avatar={a} size={38} />
              <AppText variant="microLabel" dim>
                {a.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Button label="Done" onPress={closeModal} />
    </View>
  );
}
