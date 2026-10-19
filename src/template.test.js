import assert from "node:assert/strict";
import { test } from "node:test";
import { templates } from "./data/templates.js";
import { renderTemplate, templateValues, toPlainText } from "./template.js";

test("fills placeholders from every source, uppercasing their keys", () => {
    const values = templateValues({ firstName: "Ada" }, { companyName: "Initech" });
    const segments = renderTemplate("Hi <%-FIRSTNAME-%> from <%-COMPANYNAME-%>.", values);
    assert.deepEqual(segments, [
        { text: "Hi " },
        { field: "FIRSTNAME", text: "Ada" },
        { text: " from " },
        { field: "COMPANYNAME", text: "Initech" },
        { text: "." },
    ]);
});

test("joins lists and counts them for _COUNT placeholders", () => {
    const values = templateValues({ skills: ["Vue", "Go", "C#"] });
    const text = toPlainText(renderTemplate("<%-SKILLS_COUNT-%>: <%-SKILLS-%>", values));
    assert.equal(text, "3: Vue, Go, C#");
});

test("marks empty values missing and keeps the placeholder name visible", () => {
    const values = templateValues({ jobTitle: "  ", keywords: [] });
    const segments = renderTemplate("<%-JOBTITLE-%><%-KEYWORDS-%><%-KEYWORDS_COUNT-%><%-UNKNOWN-%>", values);
    assert.deepEqual(segments, [
        { field: "JOBTITLE", text: "JOBTITLE", missing: true },
        { field: "KEYWORDS", text: "KEYWORDS", missing: true },
        { text: "0" },
        { field: "UNKNOWN", text: "UNKNOWN", missing: true },
    ]);
});

test("passes markup through as text instead of interpreting it", () => {
    const values = templateValues({ contactName: "<img src=x onerror=alert(1)>" });
    const [segment] = renderTemplate("<%-CONTACTNAME-%>", values);
    assert.equal(segment.text, "<img src=x onerror=alert(1)>");
});

test("every shipped template uses only placeholders the profile and job forms provide", () => {
    const known = new Set(
        Object.keys(
            templateValues(
                {
                    firstName: "", lastName: "", email: "", phoneNumber: "", githubUsername: "", website: "",
                    currentJobTitle: "", yearsOfExperience: "", personalSummary: "", platforms: [], skills: [],
                },
                { contactName: "", companyName: "", jobTitle: "", keywords: [] },
            ),
        ),
    );
    for (const [kind, variants] of Object.entries(templates)) {
        for (const [variant, template] of Object.entries(variants)) {
            for (const [, key] of template.matchAll(/<%-([A-Z]+)(?:_COUNT)?-%>/g)) {
                assert.ok(known.has(key), `${kind}/${variant} uses unknown placeholder ${key}`);
            }
        }
    }
});
