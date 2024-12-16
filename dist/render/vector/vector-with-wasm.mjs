import { Graphviz } from "@hpcc-js/wasm-graphviz";
import options from "../../options.mjs";
import ast2dot from "../dot/index.mjs";
const OUTPUT_TYPE2FORMAT = {
    oldsvg: "svg",
    oldps2: "ps2",
    oldeps: "eps",
};
const gGraphViz = await Graphviz.load();
function getFormat(pOptions) {
    return (OUTPUT_TYPE2FORMAT[options.getOptionValue(pOptions, "outputType")] || "svg");
}
function getEngine(pOptions) {
    return options.getOptionValue(pOptions, "engine");
}
const renderVectorWithWasm = (pStateMachine, pOptions) => gGraphViz.layout(ast2dot(pStateMachine, pOptions), getFormat(pOptions), getEngine(pOptions));
export default renderVectorWithWasm;
