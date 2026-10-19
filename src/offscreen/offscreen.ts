import { isOffscreenCopyRequest, type CopyResult } from "../core/messages.ts";

/**
 * Writes text to the clipboard from inside the offscreen document. An offscreen document
 * can never take focus, which navigator.clipboard requires, so this selects the text in a
 * textarea and uses the copy command, as Chrome's offscreen clipboard sample does.
 */
export function writeToClipboard(text: string, field: HTMLTextAreaElement): CopyResult {
    field.value = text;
    field.select();
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- the only copy path without focus (Chrome offscreen clipboard sample)
    const ok = document.execCommand("copy");
    field.value = "";
    return { ok };
}

const field = document.querySelector("textarea");

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse: (result: CopyResult) => void) => {
    if (!isOffscreenCopyRequest(message) || !field) return false;
    sendResponse(writeToClipboard(message.text, field));
    return false;
});
