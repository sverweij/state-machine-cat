// @ts-check
import rules from "./rules.mjs";

/** @type {import('dependency-cruiser').IConfiguration} */
export default {
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
