<template>
    <button
        type="button"
        class="jx-dock-button"
        :class="{ 'jx-dock-button--active': ui.panel === panel }"
        :aria-pressed="ui.panel === panel"
        @click="ui.panel = ui.panel === panel ? null : panel"
    >
        <span class="jx-dock-icon"><slot /></span>
        <span class="jx-dock-label">{{ title }}</span>
    </button>
</template>

<script setup lang="ts">
import { ui } from "../store.ts";

defineProps<{ panel: NonNullable<typeof ui.panel>; title: string }>();
</script>

<style lang="scss" scoped>
.jx-dock-button {
    margin: 0 0 0 -2px;
    padding: 6px 12px;
    border: 2px solid $primary;
    background-color: $white;
    color: $primary;
    font-family: $font;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition: background 0.5s ease;

    &:first-child {
        border-radius: 4px 0 0 4px;
    }

    &:last-child {
        border-radius: 0 4px 4px 0;
    }

    &:hover,
    &.jx-dock-button--active {
        background-color: $primary;
        color: $white;
    }

    &:active {
        background-color: $primary-highlight;
        transition: background 0s;
    }
}

.jx-dock-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: auto;

    & :deep(svg) {
        width: 26px;
        height: 26px;
        fill: currentColor;
        transition: fill 0.25s ease;
    }
}
</style>
