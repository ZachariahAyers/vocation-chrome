import { computed, reactive, watch } from "vue";
import { jobBoards } from "./data/job-boards.js";
import { templates } from "./data/templates.js";

const STORAGE_KEY = "vocation";

const today = () => new Date().toDateString();

// Saved to chrome.storage.local, so the profile follows the user from site to site.
export const state = reactive({
    profile: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        githubUsername: "",
        website: "",
        currentJobTitle: "",
        yearsOfExperience: "",
        personalSummary: "",
        platforms: ["Windows", "Mac", "Linux", "iOS", "Android"],
        skills: [],
    },
    job: {
        contactName: "",
        companyName: "",
        jobTitle: "",
        keywords: [],
    },
    template: { kind: "Cover", variant: "Default" },
    boards: { day: today(), done: [] },
});

// Per page only: the overlay opens closed on every new page.
export const ui = reactive({ dockOpen: false, panel: null });

export const allBoardsDone = computed(() => jobBoards.every((board) => state.boards.done.includes(board.name)));

export function markBoardDone(name) {
    if (!state.boards.done.includes(name)) state.boards.done.push(name);
}

export function selectTemplate(kind, variant = Object.keys(templates[kind])[0]) {
    state.template.kind = kind;
    state.template.variant = variant;
}

// ponytail: last write wins between tabs open at the same time; add a storage.onChanged merge if that bites.
export async function loadState() {
    const { [STORAGE_KEY]: saved } = await chrome.storage.local.get(STORAGE_KEY);
    for (const section of Object.keys(state)) {
        if (saved?.[section]) Object.assign(state[section], saved[section]);
    }
    if (!templates[state.template.kind]?.[state.template.variant]) selectTemplate("Cover");
    if (state.boards.day !== today()) Object.assign(state.boards, { day: today(), done: [] });

    watch(state, () => chrome.storage.local.set({ [STORAGE_KEY]: JSON.parse(JSON.stringify(state)) }), {
        deep: true,
    });
}
