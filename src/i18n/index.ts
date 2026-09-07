import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

import en from './en.json';
import es from './es.json';

/**
 * Valencia-first, so Spanish is the first translation, not an afterthought (the same rationale
 * the original Milan-authored spec applied to Italian). Every user-visible string in the app now
 * resolves through here — the one deliberate exception is `app/style-guide.tsx`, a developer
 * screen. Species names, street names and handles stay untranslated: they are data, not copy.
 *
 * Two files import this as `t as tr`, because `t` is already the tree in their map callbacks.
 */
const i18n = new I18n({ en, es });

const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
i18n.locale = deviceLocale === 'es' ? 'es' : 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export function t(scope: string, options?: Record<string, unknown>): string {
  return i18n.t(scope, options);
}

export { i18n };
