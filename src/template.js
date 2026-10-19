const PLACEHOLDER = /<%-([A-Z]+)(_COUNT)?-%>/g;

/** Placeholder values keyed the way templates name them: firstName -> FIRSTNAME. */
export function templateValues(...sources) {
    const values = { DATE: new Date().toLocaleDateString("en-US", { dateStyle: "long" }) };
    for (const source of sources) {
        for (const [key, value] of Object.entries(source)) values[key.toUpperCase()] = value;
    }
    return values;
}

/**
 * Splits a template into text segments. A filled placeholder becomes { field, text };
 * an empty one keeps its name as the text and is flagged missing so the UI can mark it.
 */
export function renderTemplate(template, values) {
    const segments = [];
    let last = 0;
    for (const match of template.matchAll(PLACEHOLDER)) {
        const [token, key, count] = match;
        if (match.index > last) segments.push({ text: template.slice(last, match.index) });
        const value = values[key];
        if (count) {
            segments.push({ text: String(Array.isArray(value) ? value.length : 0) });
        } else {
            const text = (Array.isArray(value) ? value.join(", ") : String(value ?? "")).trim();
            segments.push(text ? { field: key, text } : { field: key, text: key, missing: true });
        }
        last = match.index + token.length;
    }
    if (last < template.length) segments.push({ text: template.slice(last) });
    return segments;
}

export const toPlainText = (segments) => segments.map((segment) => segment.text).join("");
