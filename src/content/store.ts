import { computed, reactive, watch } from "vue";
import { jobBoards } from "../data/job-boards.ts";
import { templates, type TemplateKind } from "../data/templates.ts";
import { defaultState, normalizeSection, sections, today, type State } from "../core/state.ts";

const STORAGE_KEY = "vocation";

/** Saved to chrome.storage.local, so the profile follows the user from site to site. */
export const state: State = reactive(defaultState());

/** Per page only: the overlay opens closed on every new page. */
export const ui = reactive({
    dockOpen: false,
    panel: null as "profile" | "boards" | "templates" | null,
});

export const allBoardsDone = computed(() => jobBoards.every((board) => state.boards.done.includes(board.name)));

export function markBoardDone(name: string): void {
    if (state.boards.day !== today()) Object.assign(state.boards, { day: today(), done: [] });
    if (!state.boards.done.includes(name)) state.boards.done.push(name);
}

export function selectTemplate(kind: TemplateKind, variant: string = Object.keys(templates[kind])[0] ?? ""): void {
    Object.assign(state.template, { kind, variant });
}

export async function loadState(): Promise<void> {
    const { [STORAGE_KEY]: saved = {} } = await chrome.storage.local.get(STORAGE_KEY);
    for (const section of sections) {
        Object.assign(state[section], normalizeSection(section, (saved as Partial<State>)[section]));
    }
    watch(state, () => void chrome.storage.local.set({ [STORAGE_KEY]: JSON.parse(JSON.stringify(state)) }), {
        deep: true,
    });
}
