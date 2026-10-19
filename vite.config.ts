/// <reference types="vitest/config" />
import { resolve } from "node:path";
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

    if (mode === "demo") {
        return {
            ...shared,
            root: "src/demo",
            base: "/opensource/vocation/",
            publicDir: false,
            build: {
                outDir: resolve(import.meta.dirname, "demo-dist"),
                emptyOutDir: true,
            },
        };
    }

    // Extension pages: the service worker and the offscreen clipboard document, as ES modules.
    // Built first, because it empties dist/.
    if (mode === "pages") {
        return {
            ...shared,
            root: "src",
            publicDir: "../public",
            build: {
                outDir: "../dist",
                emptyOutDir: true,
                rolldownOptions: {
                    input: {
                        "service-worker": resolve(import.meta.dirname, "src/background/service-worker.ts"),
                        offscreen: resolve(import.meta.dirname, "src/offscreen/offscreen.html"),
                    },
                    output: { entryFileNames: "[name].js", chunkFileNames: "chunks/[name]-[hash].js" },
                },
            },
        };
    }

    // The overlay is a content script, and content scripts load as classic scripts,
    // so it ships as one IIFE file plus its stylesheet, added to what the pages build wrote.
    return {
        ...shared,
        define: { "process.env.NODE_ENV": JSON.stringify("production") },
        build: {
            emptyOutDir: false,
            copyPublicDir: false,
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
