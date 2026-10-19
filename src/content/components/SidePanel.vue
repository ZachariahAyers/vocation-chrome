<template>
    <Transition name="fade">
        <div v-if="ui.panel" class="side" @keydown.esc="ui.panel = null">
            <aside class="side-content" :aria-label="panels[ui.panel].title">
                <component :is="panels[ui.panel].component" />
            </aside>
            <div class="side-backdrop" @click="ui.panel = null" />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import JobBoardPanel from "./JobBoardPanel.vue";
import ProfilePanel from "./ProfilePanel.vue";
import TemplatesPanel from "./TemplatesPanel.vue";
import { ui } from "../store.ts";

const panels = {
    profile: { title: "Personal", component: ProfilePanel },
    boards: { title: "Job Board", component: JobBoardPanel },
    templates: { title: "Templates", component: TemplatesPanel },
};
</script>

<style lang="scss" scoped>
.side {
    position: fixed;
    inset: 0;
    display: flex;
    pointer-events: auto;
}

.side-content {
    box-sizing: border-box;
    width: 260px;
    padding: 16px 12px 60px 15px;
    overflow-y: auto;
    background: $gray-100;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
    color: $gray-900;
    font-family: $font;
    font-size: 14px;
}

.side-backdrop {
    flex: 1;
    background: rgba(0, 0, 0, 0.4);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
