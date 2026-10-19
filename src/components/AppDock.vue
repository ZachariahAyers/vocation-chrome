<template>
    <div class="jx-dock">
        <button
            type="button"
            class="jx-dock-toggle"
            :class="{ 'jx-dock-toggle--open': ui.dockOpen }"
            :aria-expanded="ui.dockOpen"
            @click="ui.dockOpen = !ui.dockOpen"
        >
            <span class="jx-tooltip">{{ ui.dockOpen ? "Hide" : "Show" }}</span>
            <IconWork v-if="!ui.dockOpen" />
        </button>

        <Transition name="jx-collapse">
            <div v-if="ui.dockOpen" class="jx-dock-buttons">
                <DockButton panel="profile" title="Personal"><IconPersonal /></DockButton>
                <DockButton panel="boards" title="Job Board"><IconJobBoard /></DockButton>
                <DockButton panel="templates" title="Templates"><IconTemplates /></DockButton>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import DockButton from "./DockButton.vue";
import IconJobBoard from "../assets/icons/IconJobBoard.vue";
import IconPersonal from "../assets/icons/IconPersonal.vue";
import IconTemplates from "../assets/icons/IconTemplates.vue";
import IconWork from "../assets/icons/IconWork.vue";
import { ui } from "../store.js";
</script>

<style lang="scss" scoped>
@use "../styles/theme" as *;

.jx-dock {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: auto;
}

.jx-dock-toggle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin: 0 0 8px;
    padding: 0;
    border: none;
    border-radius: 5px;
    background-color: $info;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.5s ease;

    & svg {
        height: 30px;
        fill: $white;
    }

    &:hover {
        filter: brightness(1.25);
        transform: translateY(-2px);
    }

    &:active {
        filter: brightness(0.8);
        transform: translateY(2px);
    }
}

.jx-dock-toggle--open {
    width: 100%;
    height: 14px;
}

.jx-dock-buttons {
    display: flex;
    max-height: 200px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
}

.jx-collapse-enter-active,
.jx-collapse-leave-active {
    transition: max-height 0.5s;
}

.jx-collapse-enter-from,
.jx-collapse-leave-to {
    max-height: 0;
}

.jx-tooltip {
    position: absolute;
    bottom: 100%;
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 100px;
    background: $gray-900;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    color: $white;
    font-family: $font;
    font-size: 14px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
    transition: all 0.1s ease;

    &::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 50%;
        margin-left: -14px;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        border-top: 20px solid $gray-900;
        z-index: -1;
    }
}

.jx-dock-toggle:hover .jx-tooltip,
.jx-dock-toggle:focus-visible .jx-tooltip {
    opacity: 1;
    transform: translateY(0);
}
</style>
