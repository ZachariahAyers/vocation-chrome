import { sections, type Section, type State } from "../core/state.ts";
import type { StorageBackend } from "../content/sync.ts";

const KEY_PREFIX = "vocation:";

const parse = (value: string | null): unknown => {
    if (value === null) return undefined;
    try {
        return JSON.parse(value) as unknown;
    } catch {
        return undefined;
    }
};

/** Gives the existing state synchronizer the small part of chrome.storage it uses. */
export function createBrowserStorage(
    initial: State,
    storage: Pick<Storage, "getItem" | "setItem"> = window.localStorage,
    events: Pick<Window, "addEventListener"> = window,
): StorageBackend {
    const local = {
        get(keys: string[]): Promise<Record<string, unknown>> {
            return Promise.resolve(
                Object.fromEntries(
                    keys.map((key) => {
                        const storageKey = `${KEY_PREFIX}${key}`;
                        const saved = parse(storage.getItem(storageKey));
                        const value = saved ?? initial[key as Section];
                        if (saved === undefined) storage.setItem(storageKey, JSON.stringify(value));
                        return [key, value];
                    }),
                ),
            );
        },
        set(items: Record<string, unknown>): Promise<void> {
            for (const [key, value] of Object.entries(items)) {
                storage.setItem(`${KEY_PREFIX}${key}`, JSON.stringify(value));
            }
            return Promise.resolve();
        },
    } as StorageBackend["local"];

    const onChanged = {
        addListener(listener: (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => void) {
            events.addEventListener("storage", (event: StorageEvent) => {
                const key = event.key?.startsWith(KEY_PREFIX) ? event.key.slice(KEY_PREFIX.length) : "";
                if (!sections.includes(key as Section)) return;
                listener({ [key]: { oldValue: parse(event.oldValue), newValue: parse(event.newValue) } }, "local");
            });
        },
    } as StorageBackend["onChanged"];

    return { local, onChanged };
}

/** Uses the browser permission granted by the click in the standalone demo. */
export async function copyWithBrowserClipboard(
    text: string,
    clipboard: Pick<Clipboard, "writeText"> = navigator.clipboard,
): Promise<boolean> {
    try {
        await clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}
