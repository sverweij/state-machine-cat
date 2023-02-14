import viz from "viz.js";
import options from "../../options.mjs";
import ast2dot from "../dot/index.mjs";
const OUTPUT_TYPE2FORMAT = {
    oldsvg: "svg",
    oldps2: "ps2",
    oldeps: "eps",
};
const renderVectorWithViz = (pStateMachine, pOptions) => viz(ast2dot(pStateMachine, pOptions), {
    engine: options.getOptionValue(pOptions, "engine"),
    format: OUTPUT_TYPE2FORMAT[options.getOptionValue(pOptions, "outputType")] || "svg",
});
export default renderVectorWithViz;
