import type { StateCreator } from 'zustand';

/** `loading` covers the first session restore from the keychain — the app holds the splash
 * screen until it resolves, so no sign-in screen flashes in front of a returning user. */
export type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

export type Account = {
  id: string;
  email: string | null;
  displayName: string;
};

export type AuthSlice = {
  authStatus: AuthStatus;
  account: Account | null;
  /**
   * True between opening a recovery link and writing the new password. The session is real, so
   * the guard lets the app in — this is what pins it to the set-password screen until done.
   */
  recoveryMode: boolean;
  /** Set from the Supabase auth listener only — never from a screen. */
  setAccount: (account: Account | null) => void;
  setRecoveryMode: (recoveryMode: boolean) => void;
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  authStatus: 'loading',
  account: null,
  recoveryMode: false,
  setAccount: (account) =>
    set({ account, authStatus: account ? 'signedIn' : 'signedOut' }),
  setRecoveryMode: (recoveryMode) => set({ recoveryMode }),
});
