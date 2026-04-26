import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import prettier from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      prettier, // 👈 aqui
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node,
    },
  },

  ...tseslint.configs.recommended,

  // 👇 sua regra de unused vars
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // 👇 PRETTIER (sempre por último)
  prettierConfig,
  {
    rules: {
      "prettier/prettier": "error",
    },
  },
])
