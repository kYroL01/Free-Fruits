import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { AppText, Kicker } from '@/components/ui';

/** Temporary placeholder — replaced screen-by-screen in later milestones. */
export function PlaceholderScreen({ title, kicker }: { title: string; kicker: string }) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tokens.bg,
        paddingHorizontal: spacing.screenH,
        paddingTop: spacing.screenTop,
        gap: 8,
      }}
    >
      <Kicker>{kicker}</Kicker>
      <AppText variant="screenTitle">{title}</AppText>
      <AppText variant="body" dim>
        Coming in a later milestone.
      </AppText>
    </View>
  );
}
