import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

import en from './en.json';
import es from './es.json';

/**
 * Valencia-first, so Spanish is the first translation, not an afterthought (the same rationale
 * the original Milan-authored spec applied to Italian). Infrastructure + a representative set of
 * high-traffic strings (nav, onboarding, map, points, alerts) are wired through this — full
 * extraction of every literal string across the app is a mechanical follow-up, not done here.
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
