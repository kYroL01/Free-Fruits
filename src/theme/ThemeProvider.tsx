import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { useAppStore } from '@/store';
import { type ColorTokens, darkTokens, lightTokens } from './tokens';

type ThemeContextValue = {
  tokens: ColorTokens;
  dark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Dark mode is a user-toggled preference (map header + Profile -> Settings), deliberately
 * NOT tied to the OS colour scheme. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const dark = useAppStore((s) => s.darkMode);
  const toggleTheme = useAppStore((s) => s.toggleDarkMode);

  const value = useMemo<ThemeContextValue>(
    () => ({ tokens: dark ? darkTokens : lightTokens, dark, toggleTheme }),
    [dark, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
