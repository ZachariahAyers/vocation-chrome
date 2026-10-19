<template>
    <div class="jx-field">
        <textarea
            v-if="multiline"
            :id="id"
            v-model="model"
            class="jx-input jx-input--multiline"
            :class="{ 'jx-input--filled': model }"
            rows="8"
        />
        <input
            v-else
            :id="id"
            v-model="model"
            class="jx-input"
            :class="{ 'jx-input--filled': model }"
            :type="type"
            :inputmode="numeric ? 'numeric' : undefined"
        />
        <label :for="id" class="jx-label">{{ label }}</label>
    </div>
</template>

<script setup lang="ts">
import { useId } from "vue";

const { type = "text" } = defineProps<{
    label: string;
    type?: string;
    /** Brings up a number keypad while keeping the value a string. */
    numeric?: boolean;
    multiline?: boolean;
}>();

const model = defineModel<string>({ required: true });
const id = useId();
</script>

<style lang="scss" scoped>
.jx-field {
    position: relative;
    margin-top: 5px;
}

.jx-input {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 40px;
    margin: 0 0 12px;
    padding: 0.6em 0.5em;
    border: 1px solid $gray-500;
    border-radius: 3px;
    background-color: $white;
    color: $gray-900;
    font-family: $font;
    font-size: 16px;

    &:focus {
        border-color: $primary;
        outline-color: $primary;
    }
}

.jx-input--multiline {
    height: auto;
    line-height: 1.6;
    resize: none;
}

.jx-label {
    position: absolute;
    top: 2px;
    left: 16px;
    color: $gray-600;
    line-height: 1.2;
    pointer-events: none;
    transform: translateY(50%);
    transition: all 0.1s ease-in-out;
}

.jx-input:focus ~ .jx-label,
.jx-input--filled ~ .jx-label {
    top: -14px;
    padding: 0 2px;
    border-radius: 100px;
    background: $gray-100;
    font-size: 14px;
}

.jx-input:focus ~ .jx-label {
    color: $primary;
}
</style>
