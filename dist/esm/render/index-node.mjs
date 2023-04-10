import has from "lodash/has.js";
import smcatRendererAsImported from "./smcat/index.mjs";
import renderDot from "./dot/index.mjs";
import vector from "./vector/vector-native-dot-with-fallback.mjs";
import oldVector from "./vector/vector-with-viz-js.mjs";
import scjson from "./scjson/index.mjs";
import scxml from "./scxml/index.mjs";
const smcat = smcatRendererAsImported;
export default function getRenderFunction(pOutputType) {
    const lOutputType2RenderFunction = {
        smcat,
        dot: renderDot,
        svg: vector,
        eps: vector,
        ps: vector,
        ps2: vector,
        oldsvg: oldVector,
        oldps2: oldVector,
        oldeps: oldVector,
        pdf: vector,
        png: vector,
        scjson,
        scxml,
    };
    return has(lOutputType2RenderFunction, pOutputType)
        ? lOutputType2RenderFunction[pOutputType]
        : (pX) => pX;
}
