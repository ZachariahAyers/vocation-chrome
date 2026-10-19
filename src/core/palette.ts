/**
 * The extension's colour and font tokens. Vite injects them into every Sass block as
 * variables (`primaryHighlight` becomes `$primary-highlight`), and scripts import them
 * directly, so no colour is written down twice.
 */
export const palette = {
    primary: "#327bff",
    primaryHighlight: "#aac4fc",
    info: "#24a2b8",
    success: "#20c997",
    danger: "#dc3545",
    white: "#ffffff",
    gray100: "#f8f9fa",
    gray200: "#e9ecef",
    gray500: "#adb5bd",
    gray600: "#868e96",
    gray900: "#212529",
    shadow: "rgba(0, 0, 0, 0.2)",
    scrim: "rgba(0, 0, 0, 0.4)",
} as const;

export const font = "monospace";

export function sassVariables(): string {
    const colours = Object.entries(palette).map(
        ([name, value]) => `$${name.replace(/[A-Z]|\d+/g, (part) => `-${part.toLowerCase()}`)}: ${value};`,
    );
    return [...colours, `$font: ${font};`, ""].join("\n");
}
