import { describe, expect, it } from "vitest";
import { jobBoards } from "../data/job-boards.ts";
import { initials } from "./lettermark.ts";

describe("initials", () => {
    it.each([
        ["Dice", "D"],
        ["LinkedIn", "LI"],
        ["ZipRecruiter", "ZR"],
        ["The Muse", "TM"],
        ["We Work Remotely", "WW"],
        ["Underdog.io", "U"],
        ["dice", "D"],
    ])("%s is %s", (name, expected) => {
        expect(initials(name)).toBe(expected);
    });

    it("gives every job board one or two letters", () => {
        for (const board of jobBoards) expect(initials(board.name)).toMatch(/^\p{Lu}{1,2}$/u);
    });
});
