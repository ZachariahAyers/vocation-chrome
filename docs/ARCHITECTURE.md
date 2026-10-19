# Architecture

Vocation is a Manifest V3 Chrome extension with three execution contexts and no server.

```
 web page (any site)
 └─ <vocation-overlay>  closed shadow root
     └─ Vue app (content script: content.js + content.css)
          │  state ⇄ chrome.storage.local (one key per section, merged across tabs)
          │  copy  → chrome.runtime.sendMessage({ type: "copy" })
          ▼
 service worker (service-worker.js)
          │  opens offscreen/offscreen.html once (reason CLIPBOARD)
          │  → chrome.runtime.sendMessage({ type: "offscreen-copy" })
          ▼
 offscreen document → textarea + execCommand("copy") → { ok }
```

## Source layout

| Path              | Context            | Holds                                                                                                                                                                                  |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/core/`       | any                | Pure TypeScript with no `chrome` or Vue: the state schema (`state.ts`), template renderer (`template.ts`), lettermark initials, palette tokens, message types. Unit-tested directly.   |
| `src/content/`    | content script     | `main.ts` mounts the app; `store.ts` holds the reactive state and its actions; `sync.ts` binds it to storage; `clipboard.ts` asks the service worker to copy; `components/` is the UI. |
| `src/background/` | service worker     | The clipboard relay.                                                                                                                                                                   |
| `src/offscreen/`  | offscreen document | The page that performs the copy.                                                                                                                                                       |
| `src/data/`       | any                | Message templates and the job-board list.                                                                                                                                              |
| `public/`         | none               | `manifest.json` and the generated icons, copied into `dist/` unchanged.                                                                                                                |
| `scripts/`        | Node               | `generate-icons.ts` draws `public/icons/*.png` from palette tokens.                                                                                                                    |

## State

`State` (`src/core/state.ts`) has four sections: `profile`, `job` (the role being applied for), `template` (the selected kind and variant) and `boards` (boards done today). Each section is one key in `chrome.storage.local`.

- **Load:** `normalizeSection` turns whatever storage holds into a valid section. Unknown fields are dropped and mistyped ones fall back to defaults. An unknown template resets to the cover letter, and a board list from an earlier day starts empty.
- **Save:** a deep watcher per section writes the section when its JSON differs from what storage last held.
- **Other tabs:** `chrome.storage.onChanged` applies their writes and records them as the last stored value, so an applied change is never written back. Two tabs editing different fields of a section both keep their edits.
- **Page-only state** (`ui`: dock open, open panel) is not saved, so every page starts with the overlay closed.

## Templates

Templates in `src/data/templates.ts` are plain text with `<%-NAME-%>` placeholders, where NAME is a profile or job field in upper case. `<%-NAME_COUNT-%>` gives the length of a list, and `<%-DATE-%>` gives today's date. `renderTemplate` returns text segments; the preview prints them with Vue text interpolation and never `v-html`, so a value pasted from a page cannot inject markup. Empty placeholders stay visible under their own name and are highlighted.

## Isolation

The overlay mounts in a closed shadow root that loads `content.css` itself (declared in `web_accessible_resources`).

- Page CSS cannot restyle it, and its CSS cannot reach the page.
- Page scripts cannot query its fields.
- Keyboard events stop at the overlay root, so typing does not trigger site shortcuts.
- `:host { all: initial }` stops inherited page styles at the boundary.

## Clipboard

A content script is held to the page's clipboard rules, and `navigator.clipboard` is missing on plain-http pages. Copying therefore goes through the extension. The service worker opens a single offscreen document with reason `CLIPBOARD`, reusing it after the first copy and guarding against opening two at once. The offscreen document writes the text with `execCommand("copy")`, because an offscreen document can never take focus, which `navigator.clipboard` needs. This follows Chrome's offscreen clipboard sample.

## Build

`npm run build` runs Vite twice from one `vite.config.ts`:

1. `--mode pages`, rooted at `src/`: the service worker and offscreen document as ES modules, plus `public/`. It empties `dist/`.
2. `--mode content`: the overlay in library mode as a single IIFE (`content.js`) and its stylesheet (`content.css`). Content scripts load as classic scripts, so the overlay cannot be split into ES chunks.

Sass receives the palette as variables through `css.preprocessorOptions.scss.additionalData`, so a colour exists only in `src/core/palette.ts`.

## Permissions

| Permission                     | Why                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `storage`                      | Saving the profile, job details, template choice and board progress.         |
| `offscreen`                    | The clipboard document.                                                      |
| `clipboardWrite`               | Writing the copied template (Chrome's sample declares it for the same flow). |
| content script on `<all_urls>` | The dock is meant to be available on whatever page the user is writing from. |

## Tests

Vitest with happy-dom (`src/**/*.test.ts`).

- Core logic is tested directly.
- `sync.ts` runs against an in-memory storage that, like Chrome, notifies every listener of every write. It models two tabs.
- The service worker and offscreen document run against a stubbed `chrome`.
- Components are mounted with Vue Test Utils, with the clipboard module mocked.
- What specs cannot see, the real browser's rendering, shadow root and clipboard, needs a manual check of `dist/` loaded unpacked.
