import viz from "viz.js";
import options from "../../options.js";
import ast2dot from "../dot/index.js";

const OUTPUT_TYPE2FORMAT = {
  oldsvg: "svg",
  oldps2: "ps2",
  oldeps: "eps",
};

export default (pAST, pOptions) =>
  viz(ast2dot(pAST, pOptions), {
    engine: options.getOptionValue(pOptions, "engine"),
    format:
      OUTPUT_TYPE2FORMAT[options.getOptionValue(pOptions, "outputType")] ||
      "svg",
  });
