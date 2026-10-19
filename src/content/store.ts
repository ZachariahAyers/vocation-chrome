import { computed, reactive } from "vue";
import { jobBoards } from "../data/job-boards.ts";
import { templates, type TemplateKind } from "../data/templates.ts";
import { defaultState, today, type State } from "../core/state.ts";
import { syncWithStorage, type StorageBackend } from "./sync.ts";

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

export const loadState = (storage?: StorageBackend): Promise<void> => syncWithStorage(state, storage);
