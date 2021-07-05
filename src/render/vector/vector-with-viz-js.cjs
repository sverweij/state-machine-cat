const viz = require("viz.js");
const options = require("../../options.cjs");
const ast2dot = require("../dot/index.cjs");

const OUTPUT_TYPE2FORMAT = {
  oldsvg: "svg",
  oldps2: "ps2",
  oldeps: "eps",
};

module.exports = (pAST, pOptions) =>
  viz(ast2dot(pAST, pOptions), {
    engine: options.getOptionValue(pOptions, "engine"),
    format:
      OUTPUT_TYPE2FORMAT[options.getOptionValue(pOptions, "outputType")] ||
      "svg",
  });
