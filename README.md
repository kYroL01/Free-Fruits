# Free Fruits

Interactive mobile prototype for a community fruit-tree app — find free fruit trees nearby, add new ones, earn points, get alerts.

## Screens

7-screen flow in `Free Fruits.dc.html`:

- Map / discover
- Tree detail
- Add a tree
- Points & rewards
- Alerts
- Profile
- Search & filters

## Design

White / green / fuchsia palette, gold accent for legendary trees, dark-mode theme.

## Files

- `Free Fruits.dc.html` — the prototype (`.dc` document: template + logic in one file)
- `ios-frame.jsx` — iOS device frame component (status bar, nav bar, keyboard, list rows) wrapping the prototype for device-accurate preview
- `support.js` — dc-runtime, generated from `dc-runtime/src/*.ts`. Do not edit by hand; rebuild with `cd dc-runtime && bun run build`
- `github.md` — sync notes from the design tool

## Running

Open `Free Fruits.dc.html` in a browser. It boots the dc-runtime (`support.js`), loads React/ReactDOM/Babel from CDN, and renders the prototype full-page.
