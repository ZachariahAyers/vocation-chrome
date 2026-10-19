/** A content script asks the service worker to put text on the clipboard. */
export interface CopyRequest {
    type: "copy";
    text: string;
}

/** The service worker hands the text to the offscreen document, the only context that can write it. */
export interface OffscreenCopyRequest {
    type: "offscreen-copy";
    text: string;
}

export interface CopyResult {
    ok: boolean;
}

export const OFFSCREEN_DOCUMENT = "offscreen/offscreen.html";

export const isCopyRequest = (message: unknown): message is CopyRequest => isMessage(message, "copy");

export const isOffscreenCopyRequest = (message: unknown): message is OffscreenCopyRequest =>
    isMessage(message, "offscreen-copy");

function isMessage(message: unknown, type: string): boolean {
    return (
        typeof message === "object" &&
        message !== null &&
        (message as { type?: unknown }).type === type &&
        typeof (message as { text?: unknown }).text === "string"
    );
}
