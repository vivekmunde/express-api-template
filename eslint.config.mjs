import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  { ignores: ["dist/", "node_modules/", "*.config.js", "*.config.mjs"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: { project: "./tsconfig.json" },
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
    },
  },
  eslintConfigPrettier,
];
