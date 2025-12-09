import path from "node:path";
import { fileURLToPath } from "node:url";
import globals from "globals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/coverage",
      "**/docs",
      "**/dist",
      "**/node_modules",
      "**/public",
      "src/**/*-parser.mjs",
      "src/parse/smcat-ast.validate.mjs",
    ],
  },
  ...compat.extends("moving-meadow"),
  {
    files: ["**/*.js", "**/*.mjs"],

    rules: {
      "unicorn/prefer-spread": "off",
      "unicorn/prefer-top-level-await": "off",
    },
  },
  {
    files: ["**/*.mjs"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
    },

    rules: {
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-missing-import": "off",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-module": "error",
    },
  },
  {
    files: ["src/version.mts", "src/index-node.mts"],

    rules: {
      "budapestian/global-constant-pattern": "off",
    },
  },
  {
    files: ["test/**/*.spec.js", "test/**/*.spec.mts"],

    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },

    rules: {
      "n/global-require": "off",
      "no-magic-numbers": "off",
      "security/detect-non-literal-require": "off",
      "security/detect-non-literal-fs-filename": "off",
      "max-lines-per-function": "off",
      "max-lines": "off",
    },
  },
  ...compat.extends("plugin:@typescript-eslint/recommended").map((pConfig) => ({
    ...pConfig,
    files: ["**/*.ts"],
  })),
  {
    files: ["**/*.ts"],

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "script",
    },

    rules: {
      "import/no-import-module-exports": "off",
      "n/no-missing-import": "off",
    },
  },
  {
    files: ["**/*.d.ts", "**/*.d.mts"],

    rules: {
      "budapestian/global-constant-pattern": "off",
    },
  },
  ...compat.extends("plugin:@typescript-eslint/recommended").map((pConfig) => ({
    ...pConfig,
    files: ["**/*.d.ts", "**/*.d.mts", "**/*.mts", "**/*.mjs"],
  })),
  {
    files: ["**/*.d.ts", "**/*.d.mts", "**/*.mts", "**/*.mjs"],

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "script",
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-unsupported-features/node-builtins": "off",
      "no-inline-comments": "off",
      "import/no-unresolved": "off",
      "n/no-missing-import": "off",
    },
  },
];
