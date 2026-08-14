import { useState } from 'react';
import { Pressable, Share, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { useAppStore } from '@/store';
import { AppText, Button, Kicker } from '@/components/ui';

const SHARE_TARGETS = ['Messages', 'WhatsApp', 'Mail', 'More'];

export function InviteLinkModal() {
  const { tokens } = useTheme();
  const closeModal = useAppStore((s) => s.closeModal);
  const inviteCode = useAppStore((s) => s.inviteCode);
  const regenerateInviteCode = useAppStore((s) => s.regenerateInviteCode);
  const [copied, setCopied] = useState(false);

  const link = `freefruits.app/${inviteCode}`;

  const copy = async () => {
    await Clipboard.setStringAsync(`https://${link}`);
    setCopied(true);
  };

  const share = async () => {
    // The native share sheet is the real cross-app target picker — per-app buttons here are
    // just entry points into it, not separate integrations.
    await Share.share({ message: `Join me on Free Fruits: https://${link}` });
  };

  return (
    <View style={{ gap: 16 }}>
      <AppText variant="sheetTitle">Invite a forager</AppText>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.chip, backgroundColor: tokens.surface2 }}>
          <AppText variant="rowLabel">freefruits.app</AppText>
        </View>
        <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.chip, backgroundColor: tokens.fuchsiaSoft }}>
          <AppText variant="rowLabel" color={tokens.fuchsia}>
            {inviteCode}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={regenerateInviteCode}
          style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.chip, borderWidth: 1, borderColor: tokens.line }}
        >
          <AppText variant="microLabel" dim>
            NEW CODE
          </AppText>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: tokens.line,
          borderRadius: 14,
          padding: 12,
        }}
      >
        <AppText variant="body">{link}</AppText>
        <Pressable accessibilityRole="button" onPress={copy}>
          <AppText variant="microLabel" color={copied ? tokens.green : tokens.fuchsia}>
            {copied ? 'Copied' : 'Copy'}
          </AppText>
        </Pressable>
      </View>

      <AppText variant="body" dim>
        Old links keep working for 30 days after you make a new one. Friends earn you +10 points
        when they join.
      </AppText>

      <Kicker>Share via</Kicker>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {SHARE_TARGETS.map((target) => (
          <Pressable
            key={target}
            accessibilityRole="button"
            onPress={share}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: tokens.surface2,
            }}
          >
            <AppText variant="microLabel" dim>
              {target.toUpperCase()}
            </AppText>
          </Pressable>
        ))}
      </View>

      <Button label="Done" onPress={closeModal} />
    </View>
  );
}
