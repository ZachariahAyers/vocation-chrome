import { createApp } from "vue";
import App from "./App.vue";
import { loadState } from "./store.ts";

const root = document.createElement("div");
root.id = "vocation-root";
document.documentElement.append(root);

void loadState().then(() => createApp(App).mount(root));
