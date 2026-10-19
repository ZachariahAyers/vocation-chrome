import { watch } from "vue";
import { normalizeSection, sections, type Section, type State } from "../core/state.ts";

/** The parts of chrome.storage this module uses, so specs can pass a fake. */
export interface StorageBackend {
    local: Pick<chrome.storage.StorageArea, "get" | "set">;
    onChanged: Pick<typeof chrome.storage.onChanged, "addListener">;
}

/**
 * Keeps `state` and chrome.storage.local in step, one storage key per section.
 *
 * Loads every section, writes a section back whenever it changes, and applies changes
 * other tabs write, so two open tabs merge instead of overwriting each other. A section
 * is written only when it differs from what storage last held, which keeps a change that
 * arrived from another tab from echoing back.
 */
export async function syncWithStorage(state: State, storage: StorageBackend = chrome.storage): Promise<void> {
    const stored = new Map<Section, string>();

    const apply = (section: Section, value: unknown): void => {
        const next = normalizeSection(section, value);
        stored.set(section, JSON.stringify(next));
        Object.assign(state[section], next);
    };

    const saved = await storage.local.get([...sections]);
    for (const section of sections) apply(section, saved[section]);

    storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== "local") return;
        for (const section of sections) {
            if (section in changes) apply(section, changes[section]?.newValue);
        }
    });

    for (const section of sections) {
        watch(
            () => state[section],
            (value) => {
                const json = JSON.stringify(value);
                if (json === stored.get(section)) return;
                stored.set(section, json);
                void storage.local.set({ [section]: JSON.parse(json) as unknown });
            },
            { deep: true },
        );
    }
}
