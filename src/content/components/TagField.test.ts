import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TagField from "./TagField.vue";

function mountField(tags: string[]) {
    const wrapper = mount(TagField, {
        props: {
            label: "Skills",
            modelValue: tags,
            "onUpdate:modelValue": (value: string[]) => wrapper.setProps({ modelValue: value }),
        },
    });
    return wrapper;
}

describe("TagField", () => {
    it("adds the typed tag on Enter or comma", async () => {
        const wrapper = mountField(["Vue"]);
        const input = wrapper.get("input");

        await input.setValue("Go");
        await input.trigger("keydown", { key: "Enter" });
        await input.setValue("Rust ");
        await input.trigger("keydown", { key: "," });

        expect(wrapper.props("modelValue")).toEqual(["Vue", "Go", "Rust"]);
        expect((input.element as HTMLInputElement).value).toBe("");
    });

    it("ignores blanks and duplicates", async () => {
        const wrapper = mountField(["Vue"]);
        const input = wrapper.get("input");

        await input.setValue("   ");
        await input.trigger("keydown", { key: "Enter" });
        await input.setValue("Vue");
        await input.trigger("keydown", { key: "Enter" });

        expect(wrapper.props("modelValue")).toEqual(["Vue"]);
    });

    it("removes a tag from its button, and the last tag on Backspace in an empty input", async () => {
        const wrapper = mountField(["Vue", "Go", "Rust"]);

        await wrapper.get('button[aria-label="Remove Vue"]').trigger("click");
        await wrapper.get("input").trigger("keydown", { key: "Backspace" });

        expect(wrapper.props("modelValue")).toEqual(["Go"]);
    });

    it("adds what was typed when the field loses focus", async () => {
        const wrapper = mountField([]);
        const input = wrapper.get("input");

        await input.setValue("TypeScript");
        await input.trigger("blur");

        expect(wrapper.props("modelValue")).toEqual(["TypeScript"]);
    });
});
