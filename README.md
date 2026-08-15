# Free Fruits

A community map of free fruit trees. Find one nearby, walk up, check in when you're close enough, and pick. Spot a tree that isn't on the map yet? Add it — a photo with a GPS stamp is the proof.

Built with React Native + Expo (SDK 57), targeting iOS and Android.

## What it does

- **Map** — nearby trees as pins, color-coded by fruiting condition (fruiting, ripening, season over, diseased, dry, burnt, removed, fenced off). Search by species, street, or forager.
- **Add a tree** — three steps: photograph it on site (the photo carries a GPS stamp as proof), pick the species (or type an unlisted one — a community botanist rates it later), drop the pin. Duplicate detection catches trees someone already logged nearby.
- **Check in** — within 25 m of a pin, confirm the tree's still there and earn points. First check-in on a tree scores more than repeat ones.
- **Points & tiers** — sprout → picker (250) → forager (1000) → orchardist (2000). Points come from adding trees, check-ins, confirming duplicates, and inviting people.
- **Condition reports** — flag a tree as diseased, dry, burnt, removed, or fenced off, with a reason.
- **Alerts** — notified when a tracked tree starts fruiting or its condition changes.
- **Offline support** — cached map, on-device upload queue for photos taken with no signal, retry on send failure.
- **Privacy & moderation** — flag a tree as not real; location permission is explained before it's requested, with a graceful path if it's refused.
- **Dark mode**, English/Spanish localisation.

Default city center is Valencia, Spain (mock data — no real backend yet).

## Project layout

- `src/app/` — Expo Router routes (map, tree detail, add-tree flow, points, alerts, profile, filters, search, onboarding, privacy)
- `src/screens/` — screen implementations grouped by feature
- `src/domain/rules/` — pure business logic (points, tiers, cooldowns, duplicate detection, season windows, filtering) — unit tested in `src/domain/rules/__tests__/`
- `src/server/` — mock server + seed data standing in for a real backend
- `src/store/` — Zustand slices (trees, user, queue, alerts, permissions, settings, reports, UI)
- `src/theme/` — design tokens (colors, spacing, typography, motion)
- `src/i18n/` — English/Spanish strings

## Running it

```
npm install
npm start        # or: npm run ios / npm run android / npm run web
```

```
npm test          # domain rule unit tests (Jest)
npm run lint       # expo lint
```

Requires Node ≥22.13 (Expo SDK 57).

## Building & releasing

Production builds and Play Store submission run through [EAS Workflows](https://docs.expo.dev/eas/workflows/introduction/), defined in `.eas/workflows/create-production-builds.yml`:

```
eas workflow:run .eas/workflows/create-production-builds.yml --wait
```

This builds the Android app bundle and submits it to the Play Store's internal testing track. Build profiles (`development`, `preview`, `production`) are in `eas.json`.

## Design source

The original screen designs live in a [Claude Design](https://claude.ai/design) project; `github.md` (when present) tracks sync state between that project and this repo.
