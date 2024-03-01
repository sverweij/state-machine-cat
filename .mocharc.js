module.exports = {
  extension: ["js", "mjs", "ts", "mts"],
  timeout: 4000,
  // reporter: "spec",
  reporter: "dot",
  fullTrace: true,
  // recursive: true,
  spec: "test/**/*.spec.mts",
  loader: "ts-node/esm",
  // import: "tsx/esm",
};
