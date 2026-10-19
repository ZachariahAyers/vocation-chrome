# Vocation

A Chrome extension that keeps a job search moving without retyping the same details all day. It adds a small dock to the bottom of every page. From there you fill in your profile once, pick a cover letter or outreach template, and copy a finished message with the company, role and contact already in place. A second panel walks you through your job boards each day.

Built by [Zachariah Ayers](https://ayers.repair) ([GitHub](https://github.com/ZachariahAyers)).

## Why it is built this way

- **It lives on the page you are already on.** A job posting, a LinkedIn message or a recruiter email is where the writing happens, so the overlay is a content script rather than a popup you have to switch to.
- **Your details stay in your browser.** Everything is saved with `chrome.storage.local`. There is no server, no account and no network request. The only API permission is `storage`; the content script matches every page so the dock is always to hand.
- **Typed text is never treated as markup.** Templates are plain text with placeholders. The renderer splits them into text segments, and Vue prints each one as text, so a value pasted from a web page cannot inject HTML into the page it is shown on.
- **Missing details are visible.** A placeholder you have not filled stays in the preview under its own name, highlighted, so a message is never copied with a silent gap.

## Features

- **Profile:** name, email, phone, GitHub username, website, current title, years of experience, a short summary, and tag lists for platforms and skills.
- **Templates:** a cover letter, five outreach messages (recruiter, engineer, executive, thank-you, rebuttal) and three replies to recruiters (interested, maybe, not interested). Each fills from your profile plus the contact, company, job title and keywords for the role in front of you.
- **Copy to clipboard:** the filled message is copied as plain text, ready for an email or a message box.
- **Job board rounds:** a checklist of seventeen job boards. Open one from the list, mark it done, and the list resets the next day.

## Stack

- Vue 3.5 single-file components with `<script setup>` and `defineModel`
- Vue's `reactive()` as the store, persisted to `chrome.storage.local`
- Chrome Extensions Manifest V3, a single content script and stylesheet
- Vite 8 in library mode, emitting one classic script so the page needs no module loader
- Sass for component styles
- ESLint 10 with `eslint-plugin-vue`
- Node's built-in test runner for the template renderer
- GitHub Actions running lint, tests and the build on every push

## Build and load the extension

Requires Node.js 22.12 or newer.

```bash
git clone https://github.com/ZachariahAyers/vocation-chrome.git
cd vocation-chrome
npm install
npm run build
```

Then load it into Chrome:

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and choose the `dist` folder.
4. Open any web page; the dock appears at the bottom centre.

## Development

```bash
npm run dev     # rebuild dist/ on every change; reload the extension to pick it up
npm run build   # production build into dist/
npm run lint    # ESLint
npm test        # template renderer tests
```

## Project structure

```
vocation-chrome/
├── public/
│   ├── manifest.json        # Manifest V3, copied into dist/ as is
│   └── icons/               # extension icons
├── src/
│   ├── main.js              # content script entry: loads saved state, mounts the overlay
│   ├── App.vue              # overlay root
│   ├── store.js             # reactive state and chrome.storage persistence
│   ├── template.js          # placeholder renderer
│   ├── template.test.js     # renderer tests
│   ├── components/          # dock, side panel, profile, job board and template panels, form fields
│   ├── data/
│   │   ├── templates.js     # message templates
│   │   └── job-boards.js    # job board list
│   ├── assets/icons/        # job board and dock icons
│   └── styles/_theme.scss   # colour and font tokens
├── eslint.config.js
└── vite.config.js
```

## Template placeholders

Templates use `<%-NAME-%>`, where `NAME` is a profile or job field in upper case (`<%-FIRSTNAME-%>`, `<%-COMPANYNAME-%>`). A list field such as skills is joined with commas, and `<%-SKILLS_COUNT-%>` gives its length. `<%-DATE-%>` is today's date. A test checks that every shipped template uses only fields the forms provide.

## License

Apache License 2.0. See [LICENSE](LICENSE).
