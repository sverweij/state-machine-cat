// @ts-check
const rules = require("./rules.js");

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  ...rules,
  options: {
    moduleSystems: ["cjs", "es6"],
    doNotFollow: ["node_modules", "dist"],
    progress: { type: "cli-feedback" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import"],
    },
    tsConfig: {
      fileName: "./tsconfig.json",
    },
    tsPreCompilationDeps: true,
    parser: "tsc",
    exoticRequireStrings: ["requireJSON"],
    prefix: "https://github.com/sverweij/state-machine-cat/blob/develop/",
    cache: true,
    reporterOptions: {
      markdown: {
        showTitle: true,
        showSummaryHeader: false,
        showRulesSummary: false,
        showDetailsHeader: false,
        collapseDetails: false,
        showFooter: false,
      },
    },
  },
};
