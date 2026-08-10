import rules from "./rules.mts";
import type { IConfiguration } from "dependency-cruiser";

const lConfiguration:IConfiguration = {
  ...rules,
  options: {
    moduleSystems: ["cjs", "es6"],
    doNotFollow: ["node_modules", "dist"],
    progress: { type: "performance-log", maximumLevel: 50 },
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
    prefix: "https://github.com/sverweij/state-machine-cat/blob/main/",
    skipAnalysisNotInRules: true,
    cache: {
      strategy: "metadata",
      compress: true,
    },
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
export default lConfiguration;