<template>
    <div>
        <TextField
            v-for="field in fields"
            :key="field.key"
            v-model="state.profile[field.key]"
            :label="field.label"
            :type="field.type"
            :numeric="field.numeric"
            :multiline="field.multiline"
        />
        <TagField v-model="state.profile.platforms" label="Platforms" />
        <TagField v-model="state.profile.skills" label="Skills" />
    </div>
</template>

<script setup lang="ts">
import TagField from "./TagField.vue";
import TextField from "./TextField.vue";
import type { Profile } from "../../core/state.ts";
import { state } from "../store.ts";

type TextKey = { [K in keyof Profile]: Profile[K] extends string ? K : never }[keyof Profile];

interface Field {
    key: TextKey;
    label: string;
    type: "text" | "email" | "tel" | "url";
    numeric?: boolean;
    multiline?: boolean;
}

const fields: Field[] = [
    { key: "firstName", label: "First name", type: "text" },
    { key: "lastName", label: "Last name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phoneNumber", label: "Phone number", type: "tel" },
    { key: "githubUsername", label: "GitHub username", type: "text" },
    { key: "website", label: "Website", type: "url" },
    { key: "currentJobTitle", label: "Current job title", type: "text" },
    { key: "yearsOfExperience", label: "Years of experience", type: "text", numeric: true },
    { key: "personalSummary", label: "Personal summary", type: "text", multiline: true },
];
</script>
