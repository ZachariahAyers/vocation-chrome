# Vocation

[![CI](https://github.com/ZachariahAyers/vocation-chrome/actions/workflows/ci.yml/badge.svg)](https://github.com/ZachariahAyers/vocation-chrome/actions/workflows/ci.yml)

A Chrome extension that drafts cover letters and outreach messages from your profile and tracks your daily job-board rounds.

## Features

- A profile you fill in once: name, contact details, title, experience, summary, platforms and skills
- A cover letter, five outreach messages and three recruiter replies, filled in for the role in front of you
- One-click copy of the finished message as plain text
- A daily checklist of seventeen job boards that resets each day
- Your data stays in your browser, with no account and no network requests

## Tech stack

TypeScript, Vue 3, Chrome Extensions Manifest V3, Vite, Sass, Vitest.

## Getting started

Requires Node.js 22.18 or newer.

```bash
git clone https://github.com/ZachariahAyers/vocation-chrome.git
cd vocation-chrome
npm ci
npm run build
```

Then open `chrome://extensions`, turn on Developer mode, choose Load unpacked and select the `dist` folder. The dock appears at the bottom of any page.

## Development

```bash
npm run dev            # rebuild on change
npm run typecheck
npm run lint
npm run format:check
npm test
npm run check          # all of the above plus a build, as CI runs it
```

How it is put together: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## License

Apache License 2.0. See [LICENSE](LICENSE). Dock icons are from [Material Icons](https://github.com/google/material-design-icons) by Google, Apache License 2.0.

---

Built by [Zachariah Ayers](https://ayers.repair).
