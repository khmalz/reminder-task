import nextVitals from "eslint-config-next/core-web-vitals";
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from "eslint/config";
import eslintignore from "./.eslintignore.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  eslintignore,
  reactHooks.configs.flat.recommended,
]);

export default eslintConfig;
