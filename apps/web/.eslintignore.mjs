import { globalIgnores } from "eslint/config";

export default globalIgnores(["**/.*/**/*", "**/node_modules", "**/.next/**/*", "**/out/**/*", "**/.vscode/**/*", "**/dist/**/*", "**/build/**/*", "**/public/**/*"]);
