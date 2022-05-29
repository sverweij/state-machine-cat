/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  extends: "dependency-cruiser/configs/recommended-strict",
  forbidden: [
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
        pathNot: "node_modules/viz\\.js/viz\\.js$",
      },
    },
    {
      name: "no-duplicate-dep-types",
      from: {},
      to: {
        moreThanOneDependencyType: true,
        pathNot: "node_modules/viz\\.js/viz\\.js$",
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
        pathNot: "^test",
      },
      to: {
        path: "^test",
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
        path: "\\.spec\\.c?js$",
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
        pathNot: "^(bin|src/cli|test)",
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
      name: "prefer-no-lodash",
      comment:
        'We prefer depending on lodash modules (so no require("lodash"); require("lodash/blah") is ok',
      severity: "info",
      from: {},
      to: {
        path: "lodash/",
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
        "This module, that's neither in bin/ nor in cli/ nor is a test for either, depends on " +
        "cli/ and/ or bin/ code. As bin and cli are there to call other modules and not the other " +
        "way 'round, you're likely putting this module in the wrong spot.",
      severity: "error",
      from: {
        pathNot: "^src/cli|^bin|^test/cli",
      },
      to: {
        path: "^src/cli|^bin",
      },
    },
    {
      name: "no-unreachable-from-bin",
      comment:
        "This module is not reachable from the the command line interface. This means it's likely " +
        "'dead wood'. Either remove it, or start using it.",
      severity: "error",
      from: {
        path: "^bin/smcat$",
      },
      to: {
        path: "^src/",
        pathNot: [
          "^src/render/scjson/scjson.schema\\.json$",
          "^src/render/svg\\.mjs$",
          "^src/render/index\\.mjs$",
          "^src/index\\.mjs$",
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
        path: ["^src/index\\.mjs", "^src/index-node\\.mjs"],
      },
      to: {
        path: "^src",
        pathNot: [
          "^src/cli/|^src/render/scjson/scjson.schema\\.json$",
          "^src/index\\.mjs",
          "^src/index-node\\.mjs",
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
        path: "^test/[^\\.]+\\.spec\\.(mjs|cjs|js)",
      },
      to: {
        path: "^src/",
        reachable: false,
      },
    },
    {
      name: "no-esm-externals-for-non-cli",
      severity: "error",
      comment:
        "This module depends on an external module that is esm-only. While we still " +
        "have a commonjs build where this module is part of, we can't esm-only external " +
        "modules. Exceptions: modules that are reachable _only_ from cli execution.",
      from: {
        pathNot:
          "^(bin|src/cli|src/render/vector/vector-native-dot-with-fallback\\.mjs)",
      },
      to: {
        path: "node_modules/(chalk|indent-string|wrap-ansi)",
      },
    },
  ],
  options: {
    moduleSystems: ["cjs", "es6"],
    doNotFollow: "node_modules",
    progress: { type: "none" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import"],
      extensions: [".js", ".mjs"],
    },
    exoticRequireStrings: ["requireJSON"],
    prefix: "https://github.com/sverweij/state-machine-cat/blob/develop/",
    reporterOptions: {
      archi: {
        collapsePattern: "^(bin|src/(cli|transform|[^/]+/[^/]+))",
      },
      dot: {
        theme: {
          graph: { splines: "ortho", ranksep: "0.5" },
          modules: [
            {
              criteria: { source: "^src/cli" },
              attributes: { fillcolor: "#ccffcc" },
            },
            {
              criteria: { source: "^src/parse" },
              attributes: { fillcolor: "#ffccff" },
            },
            {
              criteria: { source: "^src/render" },
              attributes: { fillcolor: "#ccccff" },
            },
            {
              criteria: {
                source: "(-parser|\\.template|\\.schema|version)\\.c?js$",
              },
              attributes: { style: "filled", color: "gray" },
            },
            {
              criteria: { source: "\\.json$" },
              attributes: { shape: "cylinder" },
            },
          ],
          dependencies: [
            {
              criteria: { resolved: "^src/cli" },
              attributes: { color: "#00770077" },
            },
            {
              criteria: { resolved: "^src/parse" },
              attributes: { color: "#ff00ff77" },
            },
            {
              criteria: { resolved: "^src/render" },
              attributes: { color: "#0000ff77" },
            },
          ],
        },
      },
    },
  },
};
