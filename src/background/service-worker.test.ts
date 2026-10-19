import { beforeEach, describe, expect, it, vi } from "vitest";

type Listener = (message: unknown, sender: unknown, sendResponse: (response: unknown) => void) => boolean;

let listener: Listener;
let open: boolean;
const createDocument = vi.fn(() => {
    open = true;
    return Promise.resolve();
});
const sendMessage = vi.fn<(message: unknown) => Promise<{ ok: boolean }>>(() => Promise.resolve({ ok: true }));

vi.stubGlobal("chrome", {
    runtime: {
        ContextType: { OFFSCREEN_DOCUMENT: "OFFSCREEN_DOCUMENT" },
        getURL: (path: string) => `chrome-extension://id/${path}`,
        getContexts: () => Promise.resolve(open ? [{}] : []),
        sendMessage,
        onMessage: { addListener: (registered: Listener) => (listener = registered) },
    },
    offscreen: { Reason: { CLIPBOARD: "CLIPBOARD" }, createDocument },
});

const { copyToClipboard } = await import("./service-worker.ts");

describe("service worker clipboard relay", () => {
    beforeEach(() => {
        open = false;
        createDocument.mockClear();
        sendMessage.mockClear();
    });

    it("opens the offscreen document once and hands it the text", async () => {
        await expect(copyToClipboard("Dear Initech")).resolves.toEqual({ ok: true });
        await copyToClipboard("again");

        expect(createDocument).toHaveBeenCalledTimes(1);
        expect(createDocument).toHaveBeenCalledWith(
            expect.objectContaining({ url: "offscreen/offscreen.html", reasons: ["CLIPBOARD"] }),
        );
        expect(sendMessage).toHaveBeenLastCalledWith({ type: "offscreen-copy", text: "again" });
    });

    it("does not open a second document while the first is still opening", async () => {
        await Promise.all([copyToClipboard("a"), copyToClipboard("b")]);

        expect(createDocument).toHaveBeenCalledTimes(1);
    });

    it("reports failure when the offscreen document cannot be opened", async () => {
        createDocument.mockRejectedValueOnce(new Error("blocked"));

        await expect(copyToClipboard("text")).resolves.toEqual({ ok: false });
    });

    it("answers copy requests asynchronously and ignores other messages", async () => {
        const sendResponse = vi.fn();

        expect(listener({ type: "offscreen-copy", text: "x" }, {}, sendResponse)).toBe(false);
        expect(listener({ type: "copy", text: "Hello" }, {}, sendResponse)).toBe(true);
        await vi.waitFor(() => {
            expect(sendResponse).toHaveBeenCalledWith({ ok: true });
        });
    });
});
