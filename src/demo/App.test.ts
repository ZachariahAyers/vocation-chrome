import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { state } from "../content/store.ts";
import { resetState } from "../content/testing.ts";
import { sampleState } from "./sample.ts";
import App from "./App.vue";

describe("Vocation browser demo", () => {
    beforeEach(() => {
        resetState();
        Object.assign(state.profile, sampleState().profile);
        Object.assign(state.job, sampleState().job);
    });

    it("opens on an editable fictional application rendered by the real template", async () => {
        const wrapper = mount(App);

        const cards = wrapper.findAll(".workspace > .card");
        expect(cards.map((card) => card.get("h2").text())).toEqual(["Letter and role", "Profile", "Job-board round"]);
        const firstLetterInput = cards[0]?.get("input");
        const firstProfileInput = cards[1]?.get("input");
        expect((firstLetterInput?.element as HTMLInputElement).value).toBe("Sam Rivera");
        expect((firstProfileInput?.element as HTMLInputElement).value).toBe("Maya");
        expect(wrapper.text()).toContain("Riverbend Tools");
        expect(wrapper.findAll(".utility a").map((link) => [link.text(), link.attributes("href")])).toEqual([
            ["Open Source", "https://ayers.repair/opensource/"],
            ["Source", "https://github.com/ZachariahAyers/vocation-chrome"],
        ]);
        await firstProfileInput?.setValue("June");
        expect(wrapper.get(".preview").text()).toContain("June Chen");

        const company = wrapper
            .findAll("input")
            .find((input) => (input.element as HTMLInputElement).value === "Riverbend Tools");
        expect(company).toBeDefined();
        await company?.setValue("Northstar Studio");
        expect(wrapper.get(".preview").text()).toContain("Northstar Studio");
    });

    it("includes the real daily board checklist", async () => {
        const wrapper = mount(App);

        await wrapper.get('button[aria-label="Mark Dice done for today"]').trigger("click");

        expect(wrapper.text()).toContain("1 of 17 complete");
        expect(state.boards.done).toEqual(["Dice"]);
    });
});
