import type { IConfiguration } from "dependency-cruiser";
const lConfiguration: IConfiguration = {
  extends: "./base.mts",
  forbidden: [
    // in the lint-staged context you only see a part of the graph,
    // so a few rules there will likely raise false positives.
    // This configuration ensures dependency-cruiser will skip these
    // rules
    //
    // B.t.w. the type system will complain about this as they're not 
    // complete 'rules', but with the _extends_ they only overwrite
    // existing properties, which will still yield a valid configuration
    { name: "no-orphans", severity: "ignore" },
    { name: "no-unreachable-from-cli", severity: "ignore" },
    { name: "no-unreachable-from-api", severity: "ignore" },
    { name: "no-uncovered-by-tests", severity: "ignore" },
  ],
  options: {
    cache: false,
  },
};

export default lConfiguration;