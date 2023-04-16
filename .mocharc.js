module.exports = {
  extension: ["js", "mjs", "cjs"],
  timeout: 4000,
  // reporter: "spec",
  reporter: "dot",
  // fullTrace: true,
  // recursive: true,
  spec: "test/**/*.spec.{mjs,js,mts,cts,ts}",
  loader: "ts-node/esm",
};
