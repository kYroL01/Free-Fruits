# Auth setup (Supabase)

The app is gated: after onboarding, no screen past `/sign-in` renders without a session.
Sign-in methods are email + password and Google.

## 1. Supabase project

Dashboard > Project Settings > API. Copy the values into a local `.env` (see `.env.example`):

```
EXPO_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable/anon key>
```

`EXPO_PUBLIC_*` variables are inlined into the JS bundle. Only the publishable (anon) key goes
here — never `service_role`. `.env` is gitignored; for EAS builds set both as EAS environment
variables, plain (not secret) so the bundler can inline them.

## 2. Redirect URLs

Authentication > URL Configuration > Redirect URLs, add:

```
freefruits://auth-callback
exp://127.0.0.1:8081/--/auth-callback   # Expo Go / dev server only
```

The scheme comes from `scheme: 'freefruits'` in `app.config.ts`. It must stay in sync with
`AUTH_REDIRECT_URI` in `src/server/auth.ts`.

## 3. Google provider

1. Google Cloud Console > Credentials > OAuth client ID > **Web application**.
2. Authorized redirect URI: `https://<ref>.supabase.co/auth/v1/callback`.
3. Supabase > Authentication > Providers > Google: paste the client ID and secret.

The app uses the browser-based OAuth flow (`signInWithOAuth` + `WebBrowser.openAuthSessionAsync`),
so no `google-services.json` and no native Google SDK is required — it runs in Expo Go and in a
plain dev client. Switching to the native one-tap SDK later would need a config plugin and an
Android OAuth client keyed to the release signing certificate.

## 4. Email

Authentication > Providers > Email. With "Confirm email" on, sign-up returns no session and the
UI shows `auth.checkYourEmail`; the confirmation link deep-links back into the app and
`useAuthDeepLink` exchanges the PKCE code. With it off, sign-up signs the user straight in.

Password recovery uses the same redirect. Opening the link signs the user in with a recovery
session; `useAuthSession` flags it (`PASSWORD_RECOVERY`, or `type=recovery` on the redirect) and
the guard pins them to `/set-password` until a new password is written. The same screen handles a
voluntary change from the profile, where it asks for the current password as well.

## Password policy

`src/domain/rules/password.ts` is the single definition: **at least 8 characters, at least one
capital letter, letters and numbers only** — anything outside `A-Za-z0-9` (symbols, spaces,
accented letters) is rejected. Sign-up and set-password both check it and show the rules as a
live checklist; sign-in does not, so an account created before a policy change can still get in.

That check is client-side. Mirror it under Authentication > Policies in the dashboard (minimum
length 8, required characters `abcdefghijklmnopqrstuvwxyz` + `ABCDEFGHIJKLMNOPQRSTUVWXYZ` +
`0123456789` to taste) — the server is the half a modified client cannot skip. Supabase's
`weak_password` rejection surfaces as `auth.errorWeakPassword`.

## How it fits together

| Piece | File |
| --- | --- |
| Client + keychain token storage | `src/server/supabase.ts` |
| Sign-in/up/out, Google, reset | `src/server/auth.ts` |
| Session restore + auth listener | `src/hooks/useAuthSession.ts` |
| `authStatus` / `account` state | `src/store/slices/authSlice.ts` |
| Route guard | `src/app/_layout.tsx` (`Stack.Protected`) |
| Entry order (tour, account, map) | `src/app/index.tsx` |
| Screens | `src/screens/Auth/AuthScreen.tsx`, `src/screens/Auth/SetPasswordScreen.tsx` |
| Password policy | `src/domain/rules/password.ts` |

Tokens are stored with `expo-secure-store` (chunked, because iOS has historically rejected
keychain values over ~2048 bytes), never in the AsyncStorage blob the rest of the store persists
to. The store keeps only `account` (id, email, display name), and it is not persisted — the
session in the keychain is the source of truth on cold start.

## Still local-only

`src/server/mockServer.ts` remains a mock: trees, points and strikes are device state, now keyed
to the signed-in user id instead of the hardcoded `'me'`. Moving that data into Postgres with RLS
policies (`finder_id = auth.uid()`) is the next step.
