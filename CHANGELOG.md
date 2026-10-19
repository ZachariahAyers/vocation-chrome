# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- A standalone browser demo at `/opensource/vocation/` with a fictional editable profile, live template output, browser clipboard copy, and the daily job-board checklist.

## [2.0.0] - 2026-10-19

Chrome extension (Vue 3, Manifest V3) that drafts cover letters and recruiter messages from your saved profile, with a daily checklist of job boards.

### Added

- Vue 3, TypeScript and Vite, on Manifest V3.
- Data is saved in `chrome.storage.local`, so the profile follows you across sites. Two open tabs merge their changes through `chrome.storage.onChanged`.
- The overlay mounts in a closed shadow root. Page styles cannot restyle it, its styles do not reach the page, page scripts cannot read its fields, and keys typed in it do not trigger site shortcuts.
- Job boards show a lettermark in the extension's palette.
- The extension icon is drawn in code.
- Templates render as plain text, with missing fields highlighted by class.
- Profile values are shown as text, never as HTML.
- The board checklist resets each day.
- Copy works on plain-http pages, through the service worker and an offscreen document.
- Saved data with unknown or mistyped fields is repaired on load.

[Unreleased]: https://github.com/ZachariahAyers/vocation-chrome/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/ZachariahAyers/vocation-chrome/tree/v2.0.0
