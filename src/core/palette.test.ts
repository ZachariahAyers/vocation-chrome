import { describe, expect, it } from "vitest";
import { palette, sassVariables } from "./palette.ts";

describe("sassVariables", () => {
    it("declares every token as a kebab-case Sass variable, plus the font", () => {
        const declarations = sassVariables().trim().split("\n");

        expect(declarations).toContain(`$primary-highlight: ${palette.primaryHighlight};`);
        expect(declarations).toContain(`$gray-100: ${palette.gray100};`);
        expect(declarations).toContain("$font: monospace;");
        expect(declarations).toHaveLength(Object.keys(palette).length + 1);
    });
});
