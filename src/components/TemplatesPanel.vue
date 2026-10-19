<template>
    <div class="jx-templates">
        <div class="jx-template-kinds" role="group" aria-label="Template type">
            <button
                v-for="kind in Object.keys(templates)"
                :key="kind"
                type="button"
                class="jx-template-kind"
                :class="{ 'jx-template-kind--active': state.template.kind === kind }"
                :aria-pressed="state.template.kind === kind"
                @click="selectTemplate(kind)"
            >
                {{ kind }}
            </button>
        </div>

        <select
            v-if="variants.length > 1"
            v-model="state.template.variant"
            class="jx-template-variant"
            aria-label="Template variant"
        >
            <option v-for="variant in variants" :key="variant">{{ variant }}</option>
        </select>

        <pre class="jx-preview"><span
            v-for="(segment, index) in segments"
            :key="index"
            :class="segment.field && (segment.missing ? 'jx-value jx-value--missing' : 'jx-value')"
        >{{ segment.text }}</span></pre>

        <button type="button" class="jx-copy" @click="copy">{{ copyLabel }}</button>
        <hr>
        <TextField v-model="state.job.contactName" label="Contact name" />
        <TextField v-model="state.job.companyName" label="Company name" />
        <TextField v-model="state.job.jobTitle" label="Job title" />
        <TagField v-model="state.job.keywords" label="Keywords" />
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import TagField from "./TagField.vue";
import TextField from "./TextField.vue";
import { templates } from "../data/templates.js";
import { renderTemplate, templateValues, toPlainText } from "../template.js";
import { selectTemplate, state } from "../store.js";

const COPY_LABEL = "Copy template to clipboard";

const variants = computed(() => Object.keys(templates[state.template.kind]));
const segments = computed(() =>
    renderTemplate(
        templates[state.template.kind][state.template.variant],
        templateValues(state.profile, state.job),
    ),
);
const copyLabel = ref(COPY_LABEL);

async function copy() {
    try {
        await navigator.clipboard.writeText(toPlainText(segments.value));
        copyLabel.value = "Copied";
    } catch {
        copyLabel.value = "This page blocks the clipboard";
    }
    setTimeout(() => (copyLabel.value = COPY_LABEL), 2000);
}
</script>

<style lang="scss" scoped>
@use "../styles/theme" as *;

.jx-templates {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & hr {
        width: 100%;
    }
}

.jx-template-kinds {
    display: flex;
}

.jx-template-kind,
.jx-copy {
    padding: 6px 0;
    border: 2px solid $primary;
    background-color: $white;
    color: $primary;
    font-family: $font;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.5s ease;

    &:hover,
    &.jx-template-kind--active {
        background-color: $primary;
        color: $white;
    }

    &:active {
        background-color: $primary-highlight;
        transition: background 0s;
    }
}

.jx-template-kind {
    flex: 1;
    margin-left: -2px;

    &:first-child {
        border-radius: 4px 0 0 4px;
    }

    &:last-child {
        border-radius: 0 4px 4px 0;
    }
}

.jx-copy {
    padding: 5px;
    border-radius: 4px;
}

.jx-template-variant {
    height: 32px;
    padding: 3px;
    border: 1px solid $gray-500;
    border-radius: 4px;
    background-color: $gray-200;
    font-family: $font;
    font-size: 12px;
}

.jx-preview {
    box-sizing: border-box;
    max-height: 50vh;
    margin: 0;
    padding: 0.6em 0.5em;
    overflow-y: auto;
    border: 1px solid $gray-500;
    border-radius: 3px;
    background-color: $white;
    font-family: $font;
    font-size: 12px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.jx-value {
    padding: 1px;
    border-radius: 4px;
    background-color: $teal;
    color: $white;
}

.jx-value--missing {
    background-color: $red;
}
</style>
