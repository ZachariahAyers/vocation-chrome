<template>
    <div>
        <div v-if="allBoardsDone" class="jx-boards-done">
            <IconAward class="jx-award" />
            <h3>Congratulations! You've applied to all of your job boards for the day!</h3>
        </div>
        <TransitionGroup v-else name="jx-board" tag="ul" class="jx-boards">
            <JobBoardItem v-for="board in remaining" :key="board.name" :board="board" />
        </TransitionGroup>
    </div>
</template>

<script setup>
import { computed } from "vue";
import IconAward from "../assets/icons/IconAward.vue";
import JobBoardItem from "./JobBoardItem.vue";
import { jobBoards } from "../data/job-boards.js";
import { allBoardsDone, state } from "../store.js";

const remaining = computed(() => jobBoards.filter((board) => !state.boards.done.includes(board.name)));
</script>

<style lang="scss" scoped>
.jx-boards {
    margin: 0;
    padding: 6px 0 0;
    list-style: none;
}

.jx-boards-done {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.jx-award {
    width: 80%;
    height: auto;
}

.jx-board-leave-active {
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.jx-board-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
