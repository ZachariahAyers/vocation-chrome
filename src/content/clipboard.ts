import type { CopyRequest, CopyResult } from "../core/messages.ts";

/**
 * Copies text through the service worker and its offscreen document. A content script
 * shares the page's clipboard rules, and navigator.clipboard is missing on plain-http
 * pages and blocked on some others; the extension's own document has neither limit.
 */
export async function copyText(text: string): Promise<boolean> {
    try {
        const result = await chrome.runtime.sendMessage<CopyRequest, CopyResult | undefined>({ type: "copy", text });
        return result?.ok === true;
    } catch {
        return false;
    }
}
