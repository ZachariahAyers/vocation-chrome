export interface Segment {
    text: string;
    /** The placeholder this segment filled, for example `FIRSTNAME`. */
    field?: string;
    /** The placeholder had no value, so `text` is its name. */
    missing?: boolean;
}

export type TemplateValues = Record<string, string | string[]>;

const PLACEHOLDER = /<%-([A-Z]+)(_COUNT)?-%>/g;

/** Placeholder values keyed the way templates name them: `firstName` becomes `FIRSTNAME`. */
export function templateValues(...sources: object[]): TemplateValues {
    const values: TemplateValues = {
        DATE: new Date().toLocaleDateString("en-US", { dateStyle: "long" }),
    };
    for (const source of sources) {
        for (const [key, value] of Object.entries(source)) {
            if (typeof value === "string" || Array.isArray(value)) values[key.toUpperCase()] = value;
        }
    }
    return values;
}

/**
 * Splits a template into text segments. `<%-NAME-%>` becomes the value of NAME (lists joined
 * with commas) and `<%-NAME_COUNT-%>` the length of a list. An empty value keeps its
 * placeholder name and is flagged missing, so the preview can mark the gap.
 */
export function renderTemplate(template: string, values: TemplateValues): Segment[] {
    const segments: Segment[] = [];
    let last = 0;
    for (const match of template.matchAll(PLACEHOLDER)) {
        const [token, key = "", count] = match;
        if (match.index > last) segments.push({ text: template.slice(last, match.index) });
        const value = values[key];
        if (count) {
            segments.push({ text: String(Array.isArray(value) ? value.length : 0) });
        } else {
            const text = (Array.isArray(value) ? value.join(", ") : (value ?? "")).trim();
            segments.push(text ? { field: key, text } : { field: key, text: key, missing: true });
        }
        last = match.index + token.length;
    }
    if (last < template.length) segments.push({ text: template.slice(last) });
    return segments;
}

export const toPlainText = (segments: Segment[]): string => segments.map((segment) => segment.text).join("");
