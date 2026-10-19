<template>
    <div>
        <div v-if="allBoardsDone" class="boards-done">
            <h3>Congratulations! You've applied to all of your job boards for the day!</h3>
        </div>
        <TransitionGroup v-else name="board" tag="ul" class="boards">
            <JobBoardItem v-for="board in remaining" :key="board.name" :board="board" />
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import JobBoardItem from "./JobBoardItem.vue";
import { jobBoards } from "../../data/job-boards.ts";
import { allBoardsDone, state } from "../store.ts";

const remaining = computed(() => jobBoards.filter((board) => !state.boards.done.includes(board.name)));
</script>

<style lang="scss" scoped>
.boards {
    margin: 0;
    padding: 6px 0 0;
    list-style: none;
}

.boards-done {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.board-leave-active {
    transition:
        opacity 0.3s ease-out,
        transform 0.3s ease-out;
}

.board-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
