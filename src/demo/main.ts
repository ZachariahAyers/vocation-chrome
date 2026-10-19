import { createApp } from "vue";
import { loadState } from "../content/store.ts";
import App from "./App.vue";
import { createBrowserStorage } from "./adapters.ts";
import { sampleState } from "./sample.ts";

async function mount(): Promise<void> {
    await loadState(createBrowserStorage(sampleState()));
    createApp(App).mount("#app");
}

void mount();
