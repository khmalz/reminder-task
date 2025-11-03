import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from "eslint/config";
import eslintignore from "./.eslintignore.mjs";

const eslintConfig = defineConfig([
   ...nextVitals,
   ...nextTs,
   eslintignore,
   reactHooks.configs.flat.recommended,
]);

export default eslintConfig;
