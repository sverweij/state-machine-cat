module.exports = {
  root: true,
  extends: ["moving-meadow"],
  ignorePatterns: [
    "coverage",
    "docs",
    "dist",
    "node_modules",
    "public",
    "src/**/*-parser.mjs",
    "src/**/*.template.cjs",
  ],
  overrides: [
    {
      files: ["**/*.js", "**/*.mjs"],
      rules: {
        "unicorn/prefer-spread": "off",
        "unicorn/prefer-top-level-await": "off",
      },
    },
    {
      files: ["**/*.mjs"],
      rules: {
        "node/no-unsupported-features/es-syntax": "off",
        "unicorn/prefer-node-protocol": "error",
        "unicorn/prefer-module": "error",
      },
      parserOptions: {
        ecmaVersion: "latest",
      },
    },
    {
      files: ["src/version.mts"],
      rules: {
        "budapestian/global-constant-pattern": "off",
      },
    },
    {
      files: ["test/**/*.spec.js", "test/**/*.spec.mts"],
      env: {
        mocha: true,
      },
      rules: {
        "node/global-require": "off",
        "no-magic-numbers": "off",
        "security/detect-non-literal-require": "off",
        "security/detect-non-literal-fs-filename": "off",
        "max-lines-per-function": "off",
        "max-lines": "off",
      },
    },
    {
      files: ["*.ts"],
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2021,
      },
      rules: {
        "import/no-import-module-exports": "off",
        "node/no-missing-import": "off",
      },
    },
    {
      files: ["*.d.ts", "*.d.mts"],
      rules: {
        "budapestian/global-constant-pattern": "off",
      },
    },
    {
      files: ["*.d.ts", "*.d.mts", "*.mts", "*.mjs"],
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2021,
      },
      rules: {
        // no-unused-vars is already covered by the typescript compiler
        // moreover ts-eslint also applies it to catch clauses where it is mandatory
        // to have a parameter even if it isn't used
        "@typescript-eslint/no-unused-vars": "off",
        "node/no-unsupported-features/es-syntax": "off",
        "no-inline-comments": "off",
        "import/no-unresolved": "off",
        "node/no-missing-import": "off",
      },
    },
  ],
};
