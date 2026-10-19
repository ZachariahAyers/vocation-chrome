import { defaultState, sections } from "../core/state.ts";
import { state, ui } from "./store.ts";

/** Puts the shared overlay state back to a fresh install, for specs. */
export function resetState(): void {
    const fresh = defaultState();
    for (const section of sections) Object.assign(state[section], fresh[section]);
    Object.assign(ui, { dockOpen: false, panel: null });
}
