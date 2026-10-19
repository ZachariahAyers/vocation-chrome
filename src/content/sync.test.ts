import { describe, expect, it } from "vitest";
import { nextTick, reactive } from "vue";
import { defaultState, type State } from "../core/state.ts";
import { syncWithStorage, type StorageBackend } from "./sync.ts";

type Listener = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => void;

/** chrome.storage.local in memory: like Chrome, every listener hears every write, the writer's own included. */
function fakeStorage(initial: Record<string, unknown> = {}) {
    const data = structuredClone(initial);
    const listeners: Listener[] = [];
    const writes: Record<string, unknown>[] = [];
    const emit = (changes: Record<string, chrome.storage.StorageChange>, areaName = "local") => {
        for (const listener of listeners) listener(changes, areaName);
    };
    const backend = {
        local: {
            get: (keys: string[]) => Promise.resolve(Object.fromEntries(keys.map((key) => [key, data[key]]))),
            set: (items: Record<string, unknown>) => {
                writes.push(items);
                const changes: Record<string, chrome.storage.StorageChange> = {};
                for (const [key, newValue] of Object.entries(items)) {
                    changes[key] = { oldValue: data[key], newValue };
                    data[key] = structuredClone(newValue);
                }
                emit(changes);
                return Promise.resolve();
            },
        },
        onChanged: { addListener: (listener: Listener) => listeners.push(listener) },
    };
    return { backend: backend as unknown as StorageBackend, data, writes, emit };
}

async function openTab(storage: StorageBackend): Promise<State> {
    const state = reactive(defaultState());
    await syncWithStorage(state, storage);
    return state;
}

const settle = async () => {
    await nextTick();
    await nextTick();
};

describe("syncWithStorage", () => {
    it("loads each saved section, normalised", async () => {
        const { backend } = fakeStorage({ profile: { firstName: "Ada", email: 7 } });

        const tab = await openTab(backend);

        expect(tab.profile.firstName).toBe("Ada");
        expect(tab.profile.email).toBe("");
    });

    it("writes only the section that changed", async () => {
        const storage = fakeStorage();
        const tab = await openTab(storage.backend);

        tab.job.companyName = "Initech";
        await settle();

        expect(storage.writes).toHaveLength(1);
        expect(Object.keys(storage.writes[0] ?? {})).toEqual(["job"]);
        expect(storage.data.job).toMatchObject({ companyName: "Initech" });
    });

    it("shows a change from one tab in the other without writing it back", async () => {
        const storage = fakeStorage();
        const first = await openTab(storage.backend);
        const second = await openTab(storage.backend);

        first.profile.firstName = "Ada";
        await settle();

        expect(second.profile.firstName).toBe("Ada");
        expect(storage.writes).toHaveLength(1);
    });

    it("keeps edits made in two tabs to different fields of the same section", async () => {
        const storage = fakeStorage();
        const first = await openTab(storage.backend);
        const second = await openTab(storage.backend);

        first.profile.firstName = "Ada";
        await settle();
        second.profile.lastName = "Lovelace";
        await settle();

        expect(storage.data.profile).toMatchObject({ firstName: "Ada", lastName: "Lovelace" });
        expect(first.profile.lastName).toBe("Lovelace");
    });

    it("resets a section to its defaults when its key is removed", async () => {
        const storage = fakeStorage({ job: { companyName: "Initech" } });
        const tab = await openTab(storage.backend);

        storage.emit({ job: { oldValue: { companyName: "Initech" } } });

        expect(tab.job).toEqual(defaultState().job);
    });

    it("ignores changes to other storage areas", async () => {
        const storage = fakeStorage();
        const tab = await openTab(storage.backend);

        storage.emit({ profile: { newValue: { firstName: "Mallory" } } }, "sync");

        expect(tab.profile.firstName).toBe("");
    });
});
