import { isCopyRequest, OFFSCREEN_DOCUMENT, type CopyResult, type OffscreenCopyRequest } from "../core/messages.ts";

let creating: Promise<void> | null = null;

/** Opens the offscreen document unless it is already open; an extension may have only one. */
async function ensureOffscreenDocument(): Promise<void> {
    const contexts = await chrome.runtime.getContexts({
        contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
        documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT)],
    });
    if (contexts.length > 0) return;
    creating ??= chrome.offscreen
        .createDocument({
            url: OFFSCREEN_DOCUMENT,
            reasons: [chrome.offscreen.Reason.CLIPBOARD],
            justification: "Copy a filled template to the clipboard.",
        })
        .finally(() => (creating = null));
    await creating;
}

export async function copyToClipboard(text: string): Promise<CopyResult> {
    try {
        await ensureOffscreenDocument();
        const request: OffscreenCopyRequest = { type: "offscreen-copy", text };
        return (
            (await chrome.runtime.sendMessage<OffscreenCopyRequest, CopyResult | undefined>(request)) ?? { ok: false }
        );
    } catch {
        return { ok: false };
    }
}

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse: (result: CopyResult) => void) => {
    if (!isCopyRequest(message)) return false;
    void copyToClipboard(message.text).then(sendResponse);
    return true;
});
