<template>
    <div class="jx-tags">
        <label :for="id" class="jx-tags-label">{{ label }}</label>
        <ul class="jx-tags-box">
            <li v-for="(tag, index) in model" :key="tag" class="jx-tag">
                {{ tag }}
                <button type="button" class="jx-tag-remove" :aria-label="`Remove ${tag}`" @click="remove(index)">
                    &times;
                </button>
            </li>
            <li class="jx-tags-entry">
                <input
                    :id="id"
                    v-model="draft"
                    class="jx-tags-input"
                    :placeholder="`Add ${label.toLowerCase()}`"
                    @keydown="onKeydown"
                    @blur="add"
                />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, useId } from "vue";

defineProps<{ label: string }>();

const model = defineModel<string[]>({ required: true });
const draft = ref("");
const id = useId();

function add(): void {
    const tag = draft.value.trim();
    if (tag && !model.value.includes(tag)) model.value = [...model.value, tag];
    draft.value = "";
}

function onKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        add();
    } else if (event.key === "Backspace" && !draft.value) {
        remove(model.value.length - 1);
    }
}

function remove(index: number): void {
    if (index >= 0) model.value = model.value.filter((_, i) => i !== index);
}
</script>

<style lang="scss" scoped>
.jx-tags {
    margin-bottom: 12px;
}

.jx-tags-label {
    display: block;
    margin-bottom: 4px;
    color: $gray-600;
}

.jx-tags-box {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    box-sizing: border-box;
    min-height: 40px;
    margin: 0;
    padding: 4px 6px;
    border: 1px solid $gray-500;
    border-radius: 3px;
    background: $white;
    list-style: none;

    &:focus-within {
        border-color: $primary;
        box-shadow: 0 0 0 1px $primary;
    }
}

.jx-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 3px;
    background: $primary;
    color: $white;
}

.jx-tag-remove {
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
}

.jx-tags-entry {
    flex: 1;
    min-width: 80px;
}

.jx-tags-input {
    box-sizing: border-box;
    width: 100%;
    height: 28px;
    border: none;
    outline: none;
    background: none;
    font-family: $font;
    font-size: 14px;
}
</style>
