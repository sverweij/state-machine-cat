import has from "lodash/has.js";
import smcatRendererAsImported from "./smcat/index.mjs";
import renderDot from "./dot/index.mjs";
import svg from "./vector/vector-with-wasm.mjs";
import scjson from "./scjson/index.mjs";
import scxml from "./scxml/index.mjs";
const smcat = smcatRendererAsImported;
export default function getRenderFunction(pOutputType) {
    const lOutputType2RenderFunction = {
        smcat,
        dot: renderDot,
        svg,
        oldsvg: svg,
        scjson,
        scxml,
    };
    return has(lOutputType2RenderFunction, pOutputType)
        ? lOutputType2RenderFunction[pOutputType]
        : (pX) => pX;
}
