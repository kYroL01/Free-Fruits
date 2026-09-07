import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store';
import { AVATARS } from '@/domain/avatars';
import { t } from '@/i18n';
import { AppText, AvatarGlyph, Button, Kicker } from '@/components/ui';

export function AvatarPickerModal() {
  const { tokens } = useTheme();
  const closeModal = useAppStore((s) => s.closeModal);
  const avatarId = useAppStore((s) => s.avatarId);
  const setAvatarId = useAppStore((s) => s.setAvatarId);

  return (
    <View style={{ gap: 16 }}>
      <AppText variant="sheetTitle">{t('avatar.chooseAnAvatar')}</AppText>

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
          <AppText variant="rowLabel">{t('avatar.useAPhoto')}</AppText>
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
          <AppText variant="rowLabel">{t('avatar.initials')}</AppText>
        </View>
      </View>

      <Kicker>{t('avatar.orPickFromNature')}</Kicker>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: 10 }}>
        {AVATARS.map((a) => {
          const selected = a.id === avatarId;
          return (
            <Pressable
              key={a.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={t(`avatars.${a.id}`)}
              onPress={() => setAvatarId(a.id)}
              style={{
                // 4 across: four 22% tiles plus three 10px gaps, with slack for a wrapped label
                width: '22%',
                borderRadius: 14,
                paddingVertical: 10,
                paddingHorizontal: 4,
                overflow: 'hidden',
                backgroundColor: tokens.surface,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                borderWidth: 1.5,
                borderColor: selected ? tokens.fuchsia : tokens.line,
              }}
            >
              <AvatarGlyph avatar={a} size={38} />
              <AppText variant="microLabel" dim numberOfLines={2} style={{ textAlign: 'center' }}>
                {t(`avatars.${a.id}`)}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Button label={t('common.done')} onPress={closeModal} />
    </View>
  );
}
