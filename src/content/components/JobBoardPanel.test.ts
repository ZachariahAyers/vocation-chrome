import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { jobBoards } from "../../data/job-boards.ts";
import { state } from "../store.ts";
import { resetState } from "../testing.ts";
import JobBoardPanel from "./JobBoardPanel.vue";

describe("JobBoardPanel", () => {
    beforeEach(resetState);

    it("lists every board as a link with its lettermark", () => {
        const wrapper = mount(JobBoardPanel);
        const links = wrapper.findAll("a.board-link");

        expect(links).toHaveLength(jobBoards.length);
        expect(links[0]?.attributes("href")).toBe(jobBoards[0]?.url);
        expect(links[0]?.find("text").text()).toBe("W");
    });

    it("takes a board off today's list when it is marked done", async () => {
        const wrapper = mount(JobBoardPanel);

        await wrapper.get('button[aria-label="Mark Dice done for today"]').trigger("click");

        expect(state.boards.done).toEqual(["Dice"]);
        expect(wrapper.text()).not.toContain("Dice");
    });

    it("congratulates once every board is done", () => {
        state.boards.done = jobBoards.map((board) => board.name);

        const wrapper = mount(JobBoardPanel);

        expect(wrapper.find("ul").exists()).toBe(false);
        expect(wrapper.text()).toContain("applied to all of your job boards for the day");
    });
});
