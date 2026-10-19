import { createApp } from "vue";
import App from "./App.vue";
import "./overlay.css";
import { loadState } from "./store.ts";

/**
 * Mounts the overlay inside a closed shadow root. Page styles cannot reach it, its styles
 * cannot leak into the page, and page scripts cannot read the profile out of its fields.
 */
async function mount(): Promise<void> {
    const host = document.createElement("vocation-overlay");
    const shadow = host.attachShadow({ mode: "closed" });

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = chrome.runtime.getURL("content.css");
    const styled = new Promise((resolve) => {
        stylesheet.addEventListener("load", resolve, { once: true });
        stylesheet.addEventListener("error", resolve, { once: true });
    });

    const root = document.createElement("div");
    // Keys typed into the overlay must not reach the page's own keyboard shortcuts.
    for (const type of ["keydown", "keyup", "keypress"]) {
        root.addEventListener(type, (event) => {
            event.stopPropagation();
        });
    }

    shadow.append(stylesheet, root);
    document.documentElement.append(host);

    await Promise.all([loadState(), styled]);
    createApp(App).mount(root);
}

void mount();
