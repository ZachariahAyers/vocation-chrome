<template>
    <div class="confetti" aria-hidden="true">
        <div v-for="index in 100" :key="index" :class="`confetti-${index}`" />
    </div>
</template>

<style lang="scss" scoped>
@use "sass:list";
@use "sass:math";

$colors: (#d13447, #ffbf00, #263672);

.confetti {
    position: fixed;
    inset: 0;
    overflow: hidden;
}

[class^="confetti-"] {
    position: absolute;
}

@for $i from 1 through 100 {
    $w: math.random(8);
    $l: math.random(150);

    .confetti-#{$i} {
        top: -10%;
        left: $l * 1%;
        width: $w * 1px;
        height: $w * 0.4px;
        background-color: list.nth($colors, math.random(3));
        opacity: math.random() + 0.5;
        transform: rotate(math.random() * 360deg);
        animation: drop-#{$i} (4s + math.random() * 1s) (math.random() * 1s) forwards;
    }

    @keyframes drop-#{$i} {
        100% {
            top: 110%;
            left: ($l + math.random(15)) * 1%;
        }
    }
}
</style>
