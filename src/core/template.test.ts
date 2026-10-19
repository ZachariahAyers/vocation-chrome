import { describe, expect, it } from "vitest";
import { templates } from "../data/templates.ts";
import { defaultState } from "./state.ts";
import { renderTemplate, templateValues, toPlainText } from "./template.ts";

describe("renderTemplate", () => {
    it("fills placeholders from every source, keyed by the upper-cased field name", () => {
        const values = templateValues({ firstName: "Ada" }, { companyName: "Initech" });

        expect(renderTemplate("Hi <%-FIRSTNAME-%> from <%-COMPANYNAME-%>.", values)).toEqual([
            { text: "Hi " },
            { field: "FIRSTNAME", text: "Ada" },
            { text: " from " },
            { field: "COMPANYNAME", text: "Initech" },
            { text: "." },
        ]);
    });

    it("joins a list with commas and counts it for a _COUNT placeholder", () => {
        const values = templateValues({ skills: ["Vue", "Go", "C#"] });

        expect(toPlainText(renderTemplate("<%-SKILLS_COUNT-%>: <%-SKILLS-%>", values))).toBe("3: Vue, Go, C#");
    });

    it("marks an empty, blank or unknown value missing and shows the placeholder name", () => {
        const values = templateValues({ jobTitle: "  ", keywords: [] });

        expect(renderTemplate("<%-JOBTITLE-%><%-KEYWORDS-%><%-KEYWORDS_COUNT-%><%-UNKNOWN-%>", values)).toEqual([
            { field: "JOBTITLE", text: "JOBTITLE", missing: true },
            { field: "KEYWORDS", text: "KEYWORDS", missing: true },
            { text: "0" },
            { field: "UNKNOWN", text: "UNKNOWN", missing: true },
        ]);
    });

    it("keeps markup in a value as text", () => {
        const values = templateValues({ contactName: "<img src=x onerror=alert(1)>" });

        expect(renderTemplate("<%-CONTACTNAME-%>", values)[0]?.text).toBe("<img src=x onerror=alert(1)>");
    });

    it("fills DATE with today's date", () => {
        const today = new Date().toLocaleDateString("en-US", { dateStyle: "long" });

        expect(toPlainText(renderTemplate("<%-DATE-%>", templateValues()))).toBe(today);
    });
});

describe("shipped templates", () => {
    const { profile, job } = defaultState();
    const known = new Set(Object.keys(templateValues(profile, job)));

    for (const [kind, variants] of Object.entries(templates)) {
        for (const [variant, template] of Object.entries(variants)) {
            it(`${kind} / ${variant} uses only fields the forms provide`, () => {
                const used = [...template.matchAll(/<%-([A-Z]+)(?:_COUNT)?-%>/g)].map(([, key = ""]) => key);

                expect(used.filter((key) => !known.has(key))).toEqual([]);
            });
        }
    }
});
