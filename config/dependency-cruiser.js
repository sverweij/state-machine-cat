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
        dependencyTypes: ["npm-optional"]
      }
    },
    {
      name: "peer-deps-used",
      severity: "error",
      comment:
        "This module depends on a peer dependency. In state-machine-cat that doesn't make sense " +
        "- and hence is not allowed.",
      from: {},
      to: {
        dependencyTypes: ["npm-peer"]
      }
    },
    {
      name: "not-to-test",
      comment:
        "This module, not in the test folder, depends on something within the test folder. This means " +
        "something in there has a responsibility beyond testing, or this module belongs in the test " +
        "folder.",
      severity: "error",
      from: {
        pathNot: "^test"
      },
      to: {
        path: "^test"
      }
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
        path: "\\.spec\\.js$"
      }
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
        pathNot: "^(src/cli|test)"
      },
      to: {
        dependencyTypes: ["core"],
        path: "^fs$"
      }
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
        path: "^src"
      },
      to: {
        dependencyTypes: ["npm-dev"]
      }
    },
    {
      name: "prefer-no-lodash",
      comment:
        'We prefer depending on lodash modules (so no require("lodash"); require("lodash/blah") is ok',
      severity: "info",
      from: {},
      to: {
        path: "lodash/"
      }
    },
    {
      name: "no-parser-to-render",
      comment:
        "This parse module depends on render code. Those two are to be kept strictly separate, though, " +
        "so refactor it in such a fashion that this isn't needed anymore.",
      severity: "error",
      from: {
        path: "^src/parse/"
      },
      to: {
        path: "^src/render/"
      }
    },
    {
      name: "no-render-to-parse",
      comment:
        "This render module depends on parse code. Those two are to be kept strictly separate, though, " +
        "so refactor it in such a fashion that this isn't needed anymore.",
      severity: "error",
      from: {
        path: "^src/render/"
      },
      to: {
        path: "^src/parse/"
      }
    },
    {
      name: "no-deps-on-cli",
      comment:
        "This module, that's neither in bin/ nor in cli/ nor is a test for either, depends on " +
        "cli/ and/ or bin/ code. As bin and cli are there to call other modules and not the other " +
        "way 'round, you're likely putting this module in the wrong spot.",
      severity: "error",
      from: {
        pathNot: "^src/cli|^bin|^test/cli"
      },
      to: {
        path: "^src/cli|^bin"
      }
    },
    {
      name: "no-unreachable-from-bin",
      comment:
        "This module is not reachable from the the command line interface. This means it's likely " +
        "'dead wood'. Either remove it, or start using it.",
      severity: "error",
      from: {
        path: "^bin/smcat$"
      },
      to: {
        path: "^src/",
        pathNot: "^src/render/scjson/scjson.schema\\.json$",
        reachable: false
      }
    },
    {
      name: "no-unreachable-from-api",
      comment:
        "This module is not reachable from the the API. This means it's likely " +
        "'dead wood'. Either remove it, or start using it.",
      severity: "error",
      from: {
        path: "^src/index\\.js"
      },
      to: {
        path: "^src",
        pathNot: "^src/cli/|^src/render/scjson/scjson.schema\\.json$",
        reachable: false
      }
    },
    {
      name: "no-uncovered-by-tests",
      comment:
        "This module is not reachable from any test code. This means there's no " +
        "automated tests for it. Please write tests (later on the code coverage " +
        "checker will do a more fine grained check on this as well).",
      severity: "error",
      from: {
        path: "^test/[^\\.]+\\.spec\\.js"
      },
      to: {
        path: "^src/",
        reachable: false
      }
    }
  ],
  options: {
    moduleSystems: ["cjs"]
    // not necessary anymore as it is already in dependency-cruiser/configs/recommended
    // doNotFollow: 'node_modules'
  }
};
