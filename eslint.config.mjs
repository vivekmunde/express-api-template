import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist/", "node_modules/", "*.config.js", "*.config.mjs"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json", "./scripts/tsconfig.json"],
      },
    },
    rules: {
      "max-lines": [
        "error",
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-lines-per-function": [
        "warn",
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message:
            "Default exports are not allowed. Use named exports only (see project rules).",
        },
      ],
    },
  },
  eslintConfigPrettier,
];
