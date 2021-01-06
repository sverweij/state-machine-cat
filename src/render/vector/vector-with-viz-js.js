const viz = require("viz.js");
const options = require("../../options");
const ast2dot = require("../dot");

module.exports = (pAST, pOptions) =>
  viz(ast2dot(pAST, pOptions), {
    engine: options.getOptionValue(pOptions, "engine"),
    format: options.getOptionValue(pOptions, "outputType"),
  });
