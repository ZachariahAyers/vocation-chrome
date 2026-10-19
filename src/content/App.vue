<template>
    <div class="jx-root">
        <ConfettiRain v-if="allBoardsDone" />
        <AppDock />
        <SidePanel />
    </div>
</template>

<script setup lang="ts">
import ConfettiRain from "./components/ConfettiRain.vue";
import AppDock from "./components/AppDock.vue";
import SidePanel from "./components/SidePanel.vue";
import { allBoardsDone } from "./store.ts";
</script>

<style lang="scss" scoped>
.jx-root {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    pointer-events: none;
}
</style>
