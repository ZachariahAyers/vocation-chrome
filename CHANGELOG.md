# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [2.0.0] - 2026-10-19

A rebuild on current tooling. The features are the same as in 1; the way each one is built is new.

### Changed

- Vue 3, TypeScript and Vite in place of Vue 2, JavaScript and Vue CLI; Manifest V3 in place of Manifest V2, which Chrome no longer runs.
- Data is saved in `chrome.storage.local`, so the profile follows you across sites. Before, each site's own `localStorage` held a separate copy.
- The overlay mounts in a closed shadow root. Page styles no longer restyle it, its styles no longer reach the page, page scripts cannot read its fields, and keys typed in it no longer trigger site shortcuts.
- Job boards show a lettermark in the extension's palette instead of company logos.
- The extension icon is drawn in code.
- Templates render as plain text, with missing fields highlighted by class rather than inline styles.
- The board checklist resets each day, as its completion message says.

### Fixed

- Two open tabs no longer overwrite each other's edits; changes merge through `chrome.storage.onChanged`.
- Copy works on plain-http pages, through the service worker and an offscreen document.
- A value typed into the profile is shown as text and can no longer inject HTML into the page.
- Years of experience is kept when saved. A number input stored it as a number, which did not match the field.
- Saved data with unknown or mistyped fields is repaired on load instead of breaking the overlay.
- The engineer outreach template reads "a software engineer in your area".

### Removed

- Job boards that have shut down or moved: GitHub Jobs, Stack Overflow Jobs, Triplebyte, Hired, JobHired, UnicornHunt. AngelList is now Wellfound.
- Third-party artwork of unknown licence: board logos, the award illustration and the old extension icon.
- The empty popup page, the unfinished metrics panel and the toolbar button that did nothing.
- Unused dependencies: Vuex, vuex-persist, Vue Router, axios, Popper, moment, html-to-text and two tag-input packages.

## [1] - 2020-09-04 to 2025-10-05

The original Vue 2 and Manifest V2 extension: an overlay dock with a profile form, cover letter, outreach and response templates filled from it, and a daily checklist of job boards. Tagged `v1` at commit 16450a6.

[Unreleased]: https://github.com/ZachariahAyers/vocation-chrome/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/ZachariahAyers/vocation-chrome/compare/v1...v2.0.0
[1]: https://github.com/ZachariahAyers/vocation-chrome/tree/v1
