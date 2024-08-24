/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  extends: "./base.mjs",
  forbidden: [
    // in the lint-staged context you only see a part of the graph,
    // so a few rules there will likely raise false positives.
    // This configuration ensures dependency-cruiser will skip these
    // rules
    { name: "no-orphans", severity: "ignore" },
    { name: "no-unreachable-from-cli", severity: "ignore" },
    { name: "no-unreachable-from-api", severity: "ignore" },
    { name: "no-uncovered-by-tests", severity: "ignore" },
  ],
  options: {
    cache: false,
  },
};
