<template>
    <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="14.5" />
        <text x="16" y="16.5" text-anchor="middle" dominant-baseline="central">{{ letters }}</text>
    </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { initials } from "../../core/lettermark.ts";

const { name } = defineProps<{ name: string }>();

const letters = computed(() => initials(name));
</script>

<style lang="scss" scoped>
.mark {
    display: block;
    width: 30px;
    height: 30px;
}

circle {
    fill: $white;
    stroke: $info;
    stroke-width: 2;
}

text {
    fill: $primary;
    font-family: $font;
    font-size: 13px;
    font-weight: bold;
}
</style>
