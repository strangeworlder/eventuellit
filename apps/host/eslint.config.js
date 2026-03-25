import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.RuleEntry} */
const dsRawHtmlRule = [
  "warn",
  {
    selector: "JSXOpeningElement[name.name='p']",
    message:
      "Avoid raw <p> elements in app code. Use <Text variant=\"...\"> from @repo/ui/components/Text instead.",
  },
  {
    selector: "JSXOpeningElement[name.name=/^h[1-6]$/]",
    message:
      "Avoid raw heading elements in app code. Use <Heading> from @repo/ui/components/Heading instead.",
  },
];

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-restricted-syntax": dsRawHtmlRule,
    },
  },
]);
