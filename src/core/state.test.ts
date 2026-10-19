import { describe, expect, it } from "vitest";
import { defaultState, normalizeSection } from "./state.ts";

const monday = new Date(2026, 9, 19, 9);
const tuesday = new Date(2026, 9, 20, 9);

describe("normalizeSection", () => {
    it("returns the defaults when nothing is saved", () => {
        expect(normalizeSection("profile", undefined, monday)).toEqual(defaultState(monday).profile);
    });

    it("keeps saved fields of the right shape and drops the rest", () => {
        const saved = { firstName: "Ada", skills: ["Vue"], email: 42, platforms: [1, 2], legacy: "x" };

        expect(normalizeSection("profile", saved, monday)).toEqual({
            ...defaultState(monday).profile,
            firstName: "Ada",
            skills: ["Vue"],
        });
    });

    it("falls back to the cover letter when the saved template no longer exists", () => {
        expect(normalizeSection("template", { kind: "Outreach", variant: "Retired" }, monday)).toEqual({
            kind: "Cover",
            variant: "Default",
        });
        expect(normalizeSection("template", { kind: "Response", variant: "Maybe" }, monday)).toEqual({
            kind: "Response",
            variant: "Maybe",
        });
    });

    it("keeps today's finished boards and starts a new day empty", () => {
        const saved = { day: monday.toDateString(), done: ["Dice"] };

        expect(normalizeSection("boards", saved, monday).done).toEqual(["Dice"]);
        expect(normalizeSection("boards", saved, tuesday)).toEqual({ day: tuesday.toDateString(), done: [] });
    });
});
