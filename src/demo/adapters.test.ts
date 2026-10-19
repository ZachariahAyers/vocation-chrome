import { describe, expect, it, vi } from "vitest";
import { defaultState } from "../core/state.ts";
import { copyWithBrowserClipboard, createBrowserStorage } from "./adapters.ts";

describe("browser demo adapters", () => {
    it("starts with the fictional example and persists edits in local storage", async () => {
        const values = new Map<string, string>();
        const storage: Pick<Storage, "getItem" | "setItem"> = {
            getItem: (key: string) => values.get(key) ?? null,
            setItem: (key: string, value: string) => {
                values.set(key, value);
            },
        };
        const initial = defaultState();
        initial.profile.firstName = "Maya";
        const backend = createBrowserStorage(initial, storage);

        await expect(backend.local.get(["profile"])).resolves.toMatchObject({ profile: { firstName: "Maya" } });

        await backend.local.set({ profile: { ...initial.profile, firstName: "June" } });
        expect(JSON.parse(values.get("vocation:profile") ?? "{}")).toMatchObject({ firstName: "June" });
    });

    it("copies through the browser clipboard and reports a refusal", async () => {
        const writeText = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("denied"));

        await expect(copyWithBrowserClipboard("Draft", { writeText })).resolves.toBe(true);
        await expect(copyWithBrowserClipboard("Draft", { writeText })).resolves.toBe(false);
        expect(writeText).toHaveBeenCalledWith("Draft");
    });
});
