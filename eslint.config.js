import { vueTsConfigs, withVueTs } from "@vue/eslint-config-typescript";
import prettier from "eslint-config-prettier/flat";
import pluginVue from "eslint-plugin-vue";

export default withVueTs(
    // Icon components wrap artwork and keep its markup as authored.
    { ignores: ["dist/", "src/assets/icons/"] },
    pluginVue.configs["flat/recommended"],
    vueTsConfigs.strictTypeChecked,
    prettier,
);
