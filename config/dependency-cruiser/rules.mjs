// @ts-check
const DOT_FILE_PATTERN = "(^|/)[.][^/]+[.](js|cjs|mjs|ts|json)$";
const TS_DECLARATION_FILE_PATTERN = "[.]d[.](c|m)?ts$";
const TS_CONFIG_FILE_PATTERN = "(^|/)tsconfig[.]json$";
const OTHER_CONFIG_FILES_PATTERN =
  "(^|/)(babel|webpack)[.]config[.](js|cjs|mjs|ts|json)$";

const KNOWN_CONFIG_FILE_PATTERNS = [
  DOT_FILE_PATTERN,
  TS_DECLARATION_FILE_PATTERN,
  TS_CONFIG_FILE_PATTERN,
  OTHER_CONFIG_FILES_PATTERN,
];

/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  extends: "dependency-cruiser/configs/recommended-strict",
  forbidden: [
    {
      name: "no-orphans",
      comment:
        "This is an orphan module - it's likely not used (anymore?). Either use it or " +
        "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
        "add an exception for it in your dependency-cruiser configuration. By default " +
        "this rule does not scrutinize dotfiles (e.g. .eslintrc.js), TypeScript declaration " +
        "files (.d.ts), tsconfig.json and some of the babel and webpack configs.",
      severity: "warn",
      from: {
        orphan: true,
        pathNot: KNOWN_CONFIG_FILE_PATTERNS.concat("^tools/"),
      },
      to: {},
    },
    {
      name: "optional-deps-used",
      severity: "error",
      comment:
        "This module depends on an optional dependency. In state-machine-cat that doesn't make sense " +
        "- and hence is not allowed.",
      from: {},
      to: {
        dependencyTypes: ["npm-optional"],
      },
    },
    {
      name: "peer-deps-used",
      severity: "error",
      comment:
        "This module depends on a peer dependency. In state-machine-cat that doesn't make sense " +
        "- and hence is not allowed.",
      from: {},
      to: {
        dependencyTypes: ["npm-peer"],
      },
    },
    {
      name: "not-to-deprecated",
      from: {},
      to: {
        dependencyTypes: ["deprecated"],
      },
    },
    {
      name: "no-duplicate-dep-types",
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ["type-only"],
      },
    },
    {
      name: "not-to-test",
      comment:
        "This module, not in the test folder, depends on something within the test folder. This means " +
        "something in there has a responsibility beyond testing, or this module belongs in the test " +
        "folder.",
      severity: "error",
      from: {
        pathNot: "^test/",
      },
      to: {
        path: "^test/",
      },
    },
    {
      name: "not-to-spec",
      comment:
        "This module depends on a spec (test) file. The single responsibility of a spec module is to " +
        "test whether another module works correctly. If there's something in the spec file you need " +
        "that violates that single responsibility. Factor that what you need from within the spec " +
        "module into (e.g.) a separate utility/ helper or mock.",
      severity: "error",
      from: {},
      to: {
        path: "[.]spec[.]m?js$",
      },
    },
    {
      name: "fs-only-from-cli",
      comment:
        "This module depends on the core 'fs' module. Access to the 'fs' module is only allowed " +
        "in the cli/ part of the code (and in test/). This keeps the code easy to test, and " +
        "makes it easier to build in restrictions when necessary (i.e. for security purposes, " +
        "or when you want to run on the web - which state-machine-cat actually does).",
      severity: "error",
      from: {
        pathNot: "^(src/cli|test|tools)",
      },
      to: {
        dependencyTypes: ["core"],
        path: "^fs$",
      },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment:
        "This module looks like production code - but it depends on a development only dependency. " +
        "In production code do not depend on external ('npm') modules not declared in your package.json's " +
        "dependencies - otherwise a production only install (i.e. 'npm ci') will break. If this rule " +
        "triggers on something that's only used during development, adapt the 'from' of the rule in the " +
        "dependency-cruiser configuration.",
      from: {
        path: "^src",
      },
      to: {
        dependencyTypes: ["npm-dev"],
      },
    },
    {
      name: "no-parser-to-render",
      comment:
        "This parse module depends on render code. Those two are to be kept strictly separate, though, " +
        "so refactor it in such a fashion that this isn't needed anymore.",
      severity: "error",
      from: {
        path: "^src/parse/",
      },
      to: {
        path: "^src/render/",
      },
    },
    {
      name: "no-render-to-parse",
      comment:
        "This render module depends on parse code. Those two are to be kept strictly separate, though, " +
        "so refactor it in such a fashion that this isn't needed anymore.",
      severity: "error",
      from: {
        path: "^src/render/",
      },
      to: {
        path: "^src/parse/",
      },
    },
    {
      name: "no-deps-on-cli",
      comment:
        "This module, that's not in cli/ nor is a test for it, depends on " +
        "cli/ code. As cli is there to call other modules and not the other " +
        "way 'round, you're likely putting this module in the wrong spot.",
      severity: "error",
      from: {
        pathNot: "^src/cli|^test/cli",
      },
      to: {
        path: "^src/cli",
      },
    },
    {
      name: "no-unreachable-from-cli",
      comment:
        "This module is not reachable from the the command line interface. This means it's likely " +
        "'dead wood'. Either remove it, or start using it.",
      severity: "error",
      from: {
        path: "^src/cli/main[.]mts$",
      },
      to: {
        path: "^src/",
        pathNot: [
          // lazy loaded dynamically, so not statically analyzable
          "^src/render/index[.]mts$",
          "^src/render/smcat[.]mts$",
          "^src/render/[^/]+/",
          "^src/render/[^/]+/[^/]+/",
          // for the browser only
          "^src/index[.]mts$",
        ],
        reachable: false,
      },
    },
    {
      name: "no-unreachable-from-api",
      comment:
        "This module is not reachable from the the API. This means it's likely " +
        "'dead wood'. Either remove it, or start using it.",
      severity: "error",
      from: {
        path: ["^src/index[.]mts", "^src/index-node[.]mts"],
      },
      to: {
        path: "^src",
        pathNot: [
          // node.js cli only
          "^src/cli/",
          "^src/index[.]mts",
          // lazy loaded dynamically, so not statically analyzable
          "^src/render/vector/vector-native-dot-with-fallback[.]mts$",
          "src/render/vector/dot-to-vector-native[.]mts$",
          "^src/index-node[.]mts",
          "[.]d[.](c|m)?ts$",
        ],
        reachable: false,
      },
    },
    {
      name: "no-uncovered-by-tests",
      comment:
        "This module is not reachable from any test code. This means there's no " +
        "automated tests for it. Please write tests (later on the code coverage " +
        "checker will do a more fine grained check on this as well).",
      severity: "error",
      from: {
        path: "^test/[^[.]]+[.]spec[.](mts|js)",
      },
      to: {
        path: "^src/",
        reachable: false,
        pathNot: ["[.]d[.](c|m)?ts$", "^src/cli/main.mts$"],
      },
    },
    {
      name: "only-type-only-in-types",
      comment:
        "This type definition module (.d.ts) depends on a something that " +
        "isn't just a type. If you think what you're pulling in is OK, " +
        "import it with the `type` modifier in the import statement",
      severity: "error",
      from: {
        path: "[.]d[.]m?ts$",
      },
      to: {
        dependencyTypesNot: ["type-only"],
      },
    },
    {
      name: "only-type-only-to-dts",
      comment:
        "This module depends on a .d.ts file and it's _not_ a type-only dependency. " +
        "That's not allowed",
      severity: "error",
      from: {},
      to: {
        path: "[.]d[.][cm]?ts$",
        dependencyTypesNot: ["type-only", "type-import"],
      },
    },
    {
      name: "no-tsconfig-basedir-use",
      comment:
        "This module depends om something directly via a 'tsconfig.json' " +
        "'baseUrl' property. This is discouraged, unless you're still doing " +
        "AMD modules - see https://www.typescriptlang.org/tsconfig#baseUrl",
      severity: "warn",
      from: {},
      to: {
        // we shouldn't have this for types either, t.b.h. but it's just types
        // so shrug emoji
        pathNot: "^types/",
        dependencyTypes: ["aliased-tsconfig-base-url"],
      },
    },
  ],
};
