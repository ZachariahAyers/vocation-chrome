# Vocation

Chrome extension (Manifest V3, Vue 3, TypeScript). A content script mounts an overlay on every page with a profile form, message templates that fill from it, and a daily job-board checklist. All data stays in `chrome.storage.local`; there is no server.

## Commands

- `npm ci`: install. Node 22.18 or newer.
- `npm run check`: type check, lint, format check, specs, build. This is what CI runs; run it before every commit.
- `npm test`: specs only (Vitest, happy-dom). One file: `npx vitest run src/core/template.test.ts`.
- `npm run build`: builds the extension into `dist/`, then the standalone browser demo into `demo-dist/` with the base `/opensource/vocation/`. `npm run build:extension` and `npm run build:demo` run either output alone.
- `npm run format`: Prettier writes. `npm run icons`: regenerate `public/icons/` from the palette.
- `npm run dev` rebuilds on change and runs until stopped; do not run it as a check.

## Load the build in Chrome

Run `npm run build`, open `chrome://extensions`, turn on Developer mode, click Load unpacked and choose `dist/`. After a rebuild, click the reload icon on the extension card, then reload the page.

## Layout

- `src/core/`: pure logic with no `chrome` or Vue: state schema, template renderer, lettermarks, palette, message types.
- `src/content/`: the overlay. `main.ts` mounts it in a closed shadow root, `store.ts` holds state and actions, `sync.ts` syncs with storage across tabs, `components/` is the UI.
- `src/background/service-worker.ts` and `src/offscreen/`: the clipboard relay.
- `src/data/`: templates and job boards. `public/manifest.json` is copied as is.
- `src/demo/`: the standalone browser demo. It reuses the content components and core, adapting storage and clipboard to browser APIs.
- How the pieces fit, and why: `docs/ARCHITECTURE.md`. Read it before changing storage, the clipboard flow, the build or permissions.

## Conventions

- Strict TypeScript; `.vue` files use `<script setup lang="ts">`. Import local files with their `.ts` extension.
- Colours and the font live only in `src/core/palette.ts`. Styles use the Sass variables Vite injects from it (`$primary`, `$gray-500`); never write a colour value in a component.
- No `v-html` and no inline `style` attributes. Template values render as text segments.
- The content script runs on untrusted pages. Keep UI inside the shadow root and never read the page's DOM.
- A new saved field goes in `defaultState()` in `src/core/state.ts`; `normalizeSection` then handles older saved data.
- A template placeholder must name a profile or job field; a spec fails otherwise.
- `src/assets/icons/` is Material Icons artwork (Apache 2.0). Do not edit or reformat it.
- Every behaviour change ships with a spec that fails without the change.
- Commits follow Conventional Commits with a lower-case subject, for example `fix: keep tabs in sync`.

## Definition of done

- `npm run check` passes.
- New behaviour has a spec, and the spec was seen failing before the fix.
- UI or permission changes are tried in Chrome from `dist/`, on an https page and a plain-http page.
- User-visible changes are listed in `CHANGELOG.md` under Unreleased.
