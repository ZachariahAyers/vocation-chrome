import { afterEach, describe, expect, it, vi } from "vitest";

vi.stubGlobal("chrome", { runtime: { onMessage: { addListener: vi.fn() } } });

const { writeToClipboard } = await import("./offscreen.ts");

describe("offscreen clipboard writer", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("copies the text from a selected textarea and leaves it empty", () => {
        const field = document.createElement("textarea");
        let selected = "";
        vi.spyOn(field, "select").mockImplementation(() => (selected = field.value));
        const execCommand = vi.fn(() => true);
        Object.defineProperty(document, "execCommand", { value: execCommand, configurable: true });

        expect(writeToClipboard("Line one\nLine two", field)).toEqual({ ok: true });
        expect(selected).toBe("Line one\nLine two");
        expect(execCommand).toHaveBeenCalledWith("copy");
        expect(field.value).toBe("");
    });

    it("reports failure when the copy command is refused", () => {
        Object.defineProperty(document, "execCommand", { value: () => false, configurable: true });

        expect(writeToClipboard("text", document.createElement("textarea"))).toEqual({ ok: false });
    });
});
