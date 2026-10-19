<template>
    <div class="jx-confetti" aria-hidden="true">
        <div v-for="index in 100" :key="index" :class="`jx-confetti-${index}`" />
    </div>
</template>

<style lang="scss" scoped>
@use "sass:list";
@use "sass:math";

$colors: (#d13447, #ffbf00, #263672);

.jx-confetti {
    position: fixed;
    inset: 0;
    overflow: hidden;
}

[class^="jx-confetti-"] {
    position: absolute;
}

@for $i from 1 through 100 {
    $w: math.random(8);
    $l: math.random(150);

    .jx-confetti-#{$i} {
        top: -10%;
        left: $l * 1%;
        width: $w * 1px;
        height: $w * 0.4px;
        background-color: list.nth($colors, math.random(3));
        opacity: math.random() + 0.5;
        transform: rotate(math.random() * 360deg);
        animation: jx-drop-#{$i} (4s + math.random() * 1s) (math.random() * 1s) forwards;
    }

    @keyframes jx-drop-#{$i} {
        100% {
            top: 110%;
            left: ($l + math.random(15)) * 1%;
        }
    }
}
</style>
