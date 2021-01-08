const viz = require("viz.js");
const options = require("../../options");
const ast2dot = require("../dot");

const MAPPITYMAP = {
  oldsvg: "svg",
  oldps2: "ps2",
};

module.exports = (pAST, pOptions) =>
  viz(ast2dot(pAST, pOptions), {
    engine: options.getOptionValue(pOptions, "engine"),
    format: MAPPITYMAP[options.getOptionValue(pOptions, "outputType")] || "svg",
  });
