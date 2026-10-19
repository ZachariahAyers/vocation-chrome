<template>
    <div class="templates">
        <div class="template-kinds" role="group" aria-label="Template type">
            <button
                v-for="kind in kinds"
                :key="kind"
                type="button"
                class="template-kind"
                :class="{ 'template-kind--active': state.template.kind === kind }"
                :aria-pressed="state.template.kind === kind"
                @click="selectTemplate(kind)"
            >
                {{ kind }}
            </button>
        </div>

        <select
            v-if="variants.length > 1"
            v-model="state.template.variant"
            class="template-variant"
            aria-label="Template variant"
        >
            <option v-for="variant in variants" :key="variant">{{ variant }}</option>
        </select>

        <pre class="preview"><span
            v-for="(segment, index) in segments"
            :key="index"
            :class="segment.field && (segment.missing ? 'value value--missing' : 'value')"
        >{{ segment.text }}</span></pre>

        <button type="button" class="copy" @click="copy">{{ copyLabel }}</button>
        <hr />
        <TextField v-model="state.job.contactName" label="Contact name" />
        <TextField v-model="state.job.companyName" label="Company name" />
        <TextField v-model="state.job.jobTitle" label="Job title" />
        <TagField v-model="state.job.keywords" label="Keywords" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import TagField from "./TagField.vue";
import TextField from "./TextField.vue";
import { templates, type TemplateKind } from "../../data/templates.ts";
import { renderTemplate, templateValues, toPlainText } from "../../core/template.ts";
import { copyText } from "../clipboard.ts";
import { selectTemplate, state } from "../store.ts";

const COPY_LABEL = "Copy template to clipboard";
const { copyToClipboard = copyText } = defineProps<{
    copyToClipboard?: (text: string) => Promise<boolean>;
}>();

const kinds = Object.keys(templates) as TemplateKind[];
const variants = computed(() => Object.keys(templates[state.template.kind]));
const segments = computed(() => {
    const options: Record<string, string> = templates[state.template.kind];
    return renderTemplate(options[state.template.variant] ?? "", templateValues(state.profile, state.job));
});
const copyLabel = ref(COPY_LABEL);

async function copy(): Promise<void> {
    copyLabel.value = (await copyToClipboard(toPlainText(segments.value))) ? "Copied" : "Copy failed";
    setTimeout(() => (copyLabel.value = COPY_LABEL), 2000);
}
</script>

<style lang="scss" scoped>
.templates {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & hr {
        width: 100%;
    }
}

.template-kinds {
    display: flex;
}

.template-kind,
.copy {
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
    &.template-kind--active {
        background-color: $primary;
        color: $white;
    }

    &:active {
        background-color: $primary-highlight;
        transition: background 0s;
    }
}

.template-kind {
    flex: 1;
    margin-left: -2px;

    &:first-child {
        border-radius: 4px 0 0 4px;
    }

    &:last-child {
        border-radius: 0 4px 4px 0;
    }
}

.copy {
    padding: 5px;
    border-radius: 4px;
}

.template-variant {
    height: 32px;
    padding: 3px;
    border: 1px solid $gray-500;
    border-radius: 4px;
    background-color: $gray-200;
    font-family: $font;
    font-size: 12px;
}

.preview {
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

.value {
    padding: 1px;
    border-radius: 4px;
    background-color: $success;
    color: $white;
}

.value--missing {
    background-color: $danger;
}
</style>
