<template>
    <canvas ref="canvas" class="confetti" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { palette } from "../../core/palette.ts";

const COLOURS = [palette.primary, palette.info, palette.success, palette.danger];
const PIECES = 100;
const LONGEST_FALL_MS = 6000;

const canvas = useTemplateRef<HTMLCanvasElement>("canvas");
let frame = 0;

/** One shower of paper strips falling across the page, drawn on a canvas. Skipped for reduced motion. */
onMounted(() => {
    const element = canvas.value;
    const context = element?.getContext("2d");
    if (!element || !context || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { innerWidth: width, innerHeight: height } = window;
    element.width = width;
    element.height = height;

    const pieces = Array.from({ length: PIECES }, () => ({
        x: Math.random() * width,
        drift: (Math.random() - 0.5) * width * 0.15,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 1000,
        fall: 4000 + Math.random() * 1000,
        spin: Math.random() * Math.PI * 2,
        colour: COLOURS[Math.floor(Math.random() * COLOURS.length)] ?? palette.primary,
    }));

    const start = performance.now();
    const draw = (now: number): void => {
        const elapsed = now - start;
        context.clearRect(0, 0, width, height);
        for (const piece of pieces) {
            const progress = (elapsed - piece.delay) / piece.fall;
            if (progress < 0 || progress > 1) continue;
            context.save();
            context.translate(piece.x + piece.drift * progress, -20 + progress * (height + 40));
            context.rotate(piece.spin + progress * 6);
            context.fillStyle = piece.colour;
            context.fillRect(-piece.size / 2, -piece.size * 0.2, piece.size, piece.size * 0.4);
            context.restore();
        }
        if (elapsed < LONGEST_FALL_MS) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
});
</script>

<style lang="scss" scoped>
.confetti {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>
