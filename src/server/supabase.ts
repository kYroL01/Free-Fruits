import 'react-native-url-polyfill/auto';
import { AppState, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

/** Lets the UI show a "backend not configured" state instead of throwing on a blank .env. */
export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseKey.length > 0;

/**
 * The session holds a JWT + refresh token, so it lives in the keychain/keystore, not in the
 * AsyncStorage blob the rest of the store persists to.
 *
 * iOS has historically rejected keychain values above ~2048 bytes and a Supabase session with a
 * fat `user_metadata` can pass that, so values are split across `<key>.0`, `<key>.1`, ... and a
 * `<key>` index entry records how many parts exist. Reads that find no index fall back to the
 * single-value shape, so sessions written before chunking still load.
 */
const CHUNK_SIZE = 1800;

async function setChunked(key: string, value: string): Promise<void> {
  const parts: string[] = [];
  for (let i = 0; i < value.length; i += CHUNK_SIZE) parts.push(value.slice(i, i + CHUNK_SIZE));

  await Promise.all(parts.map((part, i) => SecureStore.setItemAsync(`${key}.${i}`, part)));
  await SecureStore.setItemAsync(key, String(parts.length));
}

async function removeChunked(key: string): Promise<void> {
  const count = Number(await SecureStore.getItemAsync(key));
  if (Number.isFinite(count) && count > 0) {
    await Promise.all(
      Array.from({ length: count }, (_, i) => SecureStore.deleteItemAsync(`${key}.${i}`))
    );
  }
  await SecureStore.deleteItemAsync(key);
}

const secureStorage: SupportedStorage = {
  getItem: async (key) => {
    const index = await SecureStore.getItemAsync(key);
    if (index === null) return null;

    const count = Number(index);
    // Pre-chunking value, or anything that isn't our index marker: return it verbatim.
    if (!Number.isInteger(count) || count <= 0) return index;

    const parts = await Promise.all(
      Array.from({ length: count }, (_, i) => SecureStore.getItemAsync(`${key}.${i}`))
    );
    // A partially-evicted session is unusable; treat it as signed out rather than as corrupt JSON.
    if (parts.some((part) => part === null)) return null;
    return parts.join('');
  },
  setItem: async (key, value) => {
    await removeChunked(key);
    await setChunked(key, value);
  },
  removeItem: removeChunked,
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Web has no keychain and reads the session back off the URL after an OAuth redirect.
    storage: Platform.OS === 'web' ? undefined : secureStorage,
    detectSessionInUrl: Platform.OS === 'web',
    autoRefreshToken: true,
    persistSession: true,
    // PKCE keeps the code exchange on-device: the redirect carries a one-time code, not a token.
    flowType: 'pkce',
  },
});

/**
 * Refresh timers must not run while the app is backgrounded — iOS suspends them and Supabase
 * then retries against a stale clock. Started once at module load, alongside the client.
 */
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
