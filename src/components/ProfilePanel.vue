<template>
    <div>
        <TextField
            v-for="field in fields"
            :key="field.key"
            v-model="state.profile[field.key]"
            :label="field.label"
            :type="field.type"
            :multiline="field.multiline"
        />
        <TagField v-model="state.profile.platforms" label="Platforms" />
        <TagField v-model="state.profile.skills" label="Skills" />
    </div>
</template>

<script setup>
import TagField from "./TagField.vue";
import TextField from "./TextField.vue";
import { state } from "../store.js";

const fields = [
    { key: "firstName", label: "First name", type: "text" },
    { key: "lastName", label: "Last name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phoneNumber", label: "Phone number", type: "tel" },
    { key: "githubUsername", label: "GitHub username", type: "text" },
    { key: "website", label: "Website", type: "url" },
    { key: "currentJobTitle", label: "Current job title", type: "text" },
    { key: "yearsOfExperience", label: "Years of experience", type: "number" },
    { key: "personalSummary", label: "Personal summary", type: "text", multiline: true },
];
</script>
