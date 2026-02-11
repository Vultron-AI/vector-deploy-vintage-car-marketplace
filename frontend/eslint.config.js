import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Allow 'any' types for flexibility
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Disable base rule in favor of @typescript-eslint version
      "no-unused-vars": "off",
      // Warn instead of error for mixed exports
      "react-refresh/only-export-components": "warn",
      // Warn for exhaustive deps (common to intentionally omit deps)
      "react-hooks/exhaustive-deps": "warn",
      // Allow empty interfaces (useful for extending)
      "@typescript-eslint/no-empty-object-type": "off",
      // Allow case block declarations
      "no-case-declarations": "off",
      // Allow unused expressions (e.g., short-circuit evaluation)
      "@typescript-eslint/no-unused-expressions": "off",
    },
  }
);
