import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { copyText } from "../clipboard.ts";
import { state } from "../store.ts";
import { resetState } from "../testing.ts";
import TemplatesPanel from "./TemplatesPanel.vue";

vi.mock("../clipboard.ts", () => ({ copyText: vi.fn(() => Promise.resolve(true)) }));

describe("TemplatesPanel", () => {
    beforeEach(() => {
        resetState();
        vi.mocked(copyText).mockClear();
    });

    it("marks filled fields and names the ones still missing", () => {
        state.job.companyName = "Initech";

        const wrapper = mount(TemplatesPanel);
        const filled = wrapper.findAll(".value:not(.value--missing)").map((span) => span.text());
        const missing = wrapper.findAll(".value--missing").map((span) => span.text());

        expect(filled).toContain("Initech");
        expect(missing).toContain("JOBTITLE");
        expect(missing).not.toContain("COMPANYNAME");
    });

    it("offers variants only for template kinds that have more than one", async () => {
        const wrapper = mount(TemplatesPanel);
        expect(wrapper.find("select").exists()).toBe(false);

        await wrapper.get('button[aria-pressed="false"]').trigger("click");

        expect(state.template).toEqual({ kind: "Outreach", variant: "Recruiter" });
        expect(wrapper.findAll("option").map((option) => option.text())).toEqual([
            "Recruiter",
            "Engineer",
            "Executive",
            "Thanks",
            "Rebuttal",
        ]);
    });

    it("copies the filled template as plain text and confirms it", async () => {
        state.job.contactName = "Sam";
        Object.assign(state.template, { kind: "Response", variant: "Interested" });
        const wrapper = mount(TemplatesPanel);

        await wrapper.get("button.copy").trigger("click");
        await flushPromises();

        expect(vi.mocked(copyText).mock.calls[0]?.[0]).toMatch(/^Hi Sam,\n\nThank you for reaching out/);
        expect(wrapper.get("button.copy").text()).toBe("Copied");
    });

    it("says so when the copy fails", async () => {
        vi.mocked(copyText).mockResolvedValueOnce(false);
        const wrapper = mount(TemplatesPanel);

        await wrapper.get("button.copy").trigger("click");
        await flushPromises();

        expect(wrapper.get("button.copy").text()).toBe("Copy failed");
    });
});
