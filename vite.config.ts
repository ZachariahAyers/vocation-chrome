/// <reference types="vitest/config" />
import vue from "@vitejs/plugin-vue";
import { defineConfig, type UserConfig } from "vite";
import { sassVariables } from "./src/core/palette.ts";

const shared: UserConfig = {
    plugins: [vue()],
    css: { preprocessorOptions: { scss: { additionalData: sassVariables() } } },
};

export default defineConfig(({ mode }): UserConfig => {
    if (mode === "test") {
        return { ...shared, test: { environment: "happy-dom", include: ["src/**/*.test.ts"] } };
    }

    // The overlay is a content script, and content scripts load as classic scripts,
    // so it ships as one IIFE file plus its stylesheet.
    return {
        ...shared,
        define: { "process.env.NODE_ENV": JSON.stringify("production") },
        build: {
            lib: {
                entry: "src/content/main.ts",
                name: "Vocation",
                formats: ["iife"],
                fileName: () => "content.js",
                cssFileName: "content",
            },
        },
    };
});
