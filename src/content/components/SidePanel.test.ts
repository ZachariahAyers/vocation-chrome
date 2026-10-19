import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { ui } from "../store.ts";
import { resetState } from "../testing.ts";
import AppDock from "./AppDock.vue";
import SidePanel from "./SidePanel.vue";

describe("dock and side panel", () => {
    beforeEach(resetState);

    it("opens a panel from its dock button and closes it from the same button", async () => {
        const dock = mount(AppDock);
        await dock.get(".dock-toggle").trigger("click");

        await dock.get('button[aria-pressed="false"]').trigger("click");
        expect(ui.panel).toBe("profile");

        await dock.get('button[aria-pressed="true"]').trigger("click");
        expect(ui.panel).toBeNull();
    });

    it("closes on Escape and on a click outside the panel", async () => {
        ui.panel = "templates";
        const panel = mount(SidePanel);

        await panel.get(".side").trigger("keydown", { key: "Escape" });
        expect(ui.panel).toBeNull();

        ui.panel = "boards";
        await panel.vm.$nextTick();
        await panel.get(".side-backdrop").trigger("click");
        expect(ui.panel).toBeNull();
    });
});
