import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
    // Icon components wrap hand-made artwork and keep its markup as authored.
    { ignores: ["dist/", "src/assets/icons/"] },
    js.configs.recommended,
    ...pluginVue.configs["flat/recommended"],
    {
        languageOptions: {
            sourceType: "module",
            globals: { ...globals.browser, ...globals.webextensions },
        },
        rules: {
            "vue/html-indent": ["error", 4],
            "vue/max-attributes-per-line": "off",
            "vue/singleline-html-element-content-newline": "off",
        },
    },
    {
        files: ["*.config.js", "**/*.test.js"],
        languageOptions: { globals: globals.node },
    },
];
