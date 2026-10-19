import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// The overlay ships as a single classic content script plus one stylesheet,
// both listed in public/manifest.json.
export default defineConfig({
    plugins: [vue()],
    define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
    },
    build: {
        lib: {
            entry: "src/main.js",
            name: "Vocation",
            formats: ["iife"],
            fileName: () => "content.js",
            cssFileName: "content",
        },
    },
});
