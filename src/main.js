import { createApp } from "vue";
import App from "./App.vue";
import { loadState } from "./store.js";

const root = document.createElement("div");
root.id = "jx-root";
document.body.prepend(root);

loadState().then(() => createApp(App).mount(root));
