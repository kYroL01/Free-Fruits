import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppStore } from '@/store';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { fontsToLoad } from '@/theme/fonts';
import { ModalHost } from '@/components/modals/ModalHost';
import { QueueDrainer } from '@/components/QueueDrainer';
import { useAuthDeepLink, useAuthSession } from '@/hooks/useAuthSession';

SplashScreen.preventAutoHideAsync().catch(() => {});

function useStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, [hydrated]);

  return hydrated;
}

function RootNavigator() {
  const { tokens, dark } = useTheme();
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const signedIn = useAppStore((s) => s.authStatus === 'signedIn');
  const recoveryMode = useAppStore((s) => s.recoveryMode);

  useAuthDeepLink();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      {/* The app needs a signed-in account: everything past the tour sits behind the guard, and
          a sign-out makes those screens disappear, dropping the user back on index. */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: tokens.bg } }}>
        <Stack.Protected guard={!hasOnboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={hasOnboarded && !signedIn}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>

        {/* Recovery pins the user here: the rest of the app stays out of the stack until the
            new password is written, and index redirects anything that tries. */}
        <Stack.Protected guard={hasOnboarded && signedIn}>
          <Stack.Screen name="set-password" />
        </Stack.Protected>

        <Stack.Protected guard={hasOnboarded && signedIn && !recoveryMode}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-tree" />
          <Stack.Screen name="filters" />
          <Stack.Screen name="search" />
          <Stack.Screen name="tree/[id]" />
        </Stack.Protected>
      </Stack>
      <ModalHost />
      <QueueDrainer />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontsToLoad);
  const storeHydrated = useStoreHydrated();
  // Holding the splash until the keychain session is restored keeps a returning user from
  // seeing the sign-in screen flash before the guard flips.
  const authResolved = useAuthSession();
  const ready = (fontsLoaded || !!fontError) && storeHydrated && authResolved;

  const onLayoutRootView = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
