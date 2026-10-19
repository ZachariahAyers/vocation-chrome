<template>
    <div class="jx-root">
        <ConfettiRain v-if="allBoardsDone" />
        <AppDock />
        <SidePanel />
    </div>
</template>

<script setup>
import ConfettiRain from "./components/ConfettiRain.vue";
import AppDock from "./components/AppDock.vue";
import SidePanel from "./components/SidePanel.vue";
import { allBoardsDone } from "./store.js";
</script>

<style lang="scss" scoped>
.jx-root {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    pointer-events: none;
}
</style>
