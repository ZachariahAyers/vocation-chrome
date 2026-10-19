<template>
    <li class="board">
        <a class="board-link" :href="board.url">
            <BoardMark class="board-logo" :name="board.name" />
            {{ board.name }}
        </a>
        <button
            type="button"
            class="board-done"
            :aria-label="`Mark ${board.name} done for today`"
            @click="markBoardDone(board.name)"
        >
            &times;
        </button>
    </li>
</template>

<script setup lang="ts">
import BoardMark from "./BoardMark.vue";
import type { JobBoard } from "../../data/job-boards.ts";
import { markBoardDone } from "../store.ts";

defineProps<{ board: JobBoard }>();
</script>

<style lang="scss" scoped>
.board {
    position: relative;
    display: flex;
    width: 90%;
    height: 40px;
    margin: 0 auto 10px;
}

.board-link {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid $primary;
    border-radius: 10px 0 0 10px;
    background-color: $white;
    box-shadow:
        0 2px 2px $shadow,
        0 1px 5px $shadow;
    color: $primary;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    text-transform: uppercase;
    transition: all 0.5s ease;

    &:hover,
    &:focus-visible {
        background-color: $primary;
        color: $white;
    }

    &:hover .board-logo {
        animation: wiggle 1s ease-in-out;
    }
}

.board-logo {
    position: absolute;
    top: -6px;
    left: -6px;
}

.board-done {
    width: 16px;
    padding: 0;
    border: none;
    border-radius: 0 10px 10px 0;
    background-color: $danger;
    color: $danger;
    font-size: 1.2em;
    cursor: pointer;
    filter: brightness(0.9);
    transition: width 0.2s ease;

    &:hover,
    &:focus-visible {
        width: 32px;
        color: $white;
        filter: brightness(1.1);
    }
}

@keyframes wiggle {
    0% {
        transform: rotate(10deg);
    }
    25% {
        transform: rotate(-10deg);
    }
    50% {
        transform: rotate(20deg);
    }
    75% {
        transform: rotate(-5deg);
    }
    100% {
        transform: rotate(0deg);
    }
}
</style>
