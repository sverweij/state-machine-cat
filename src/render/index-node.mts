/* eslint-disable security/detect-object-injection */
import has from "lodash/has.js";
import type {
  OutputType,
  RenderFunctionType,
  StringRenderFunctionType,
} from "types/state-machine-cat.js";
import smcatRendererAsImported from "./smcat/index.js";
import renderDot from "./dot/index.mjs";
import vector from "./vector/vector-native-dot-with-fallback.mjs";
import oldVector from "./vector/vector-with-viz-js.mjs";
import scjson from "./scjson/index.mjs";
import scxml from "./scxml/index.mjs";

// tsc doesn't recognize the function that smcat/index.js exports as
// StringRenderFunctionType, so we hack around it
const smcat = smcatRendererAsImported as StringRenderFunctionType;

export default function getRenderFunction(
  pOutputType: OutputType
): RenderFunctionType {
  const lOutputType2RenderFunction: {
    [outputType: string]: RenderFunctionType;
  } = {
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
