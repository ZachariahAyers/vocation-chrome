import { describe, expect, it, vi } from "vitest";
import { copyText } from "./clipboard.ts";

describe("extension clipboard adapter", () => {
    it("keeps copying through the extension service worker", async () => {
        const sendMessage = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal("chrome", { runtime: { sendMessage } });

        await expect(copyText("Draft")).resolves.toBe(true);
        expect(sendMessage).toHaveBeenCalledWith({ type: "copy", text: "Draft" });

        vi.unstubAllGlobals();
    });
});
