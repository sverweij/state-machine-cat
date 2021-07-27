/* eslint-disable security/detect-object-injection */
import has from "lodash.has";
import smcat from "./smcat/index.js";
import dot from "./dot/index.mjs";
import vector from "./vector/vector-native-dot-with-fallback.mjs";
import oldVector from "./vector/vector-with-viz-js.mjs";
import scjson from "./scjson/index.mjs";
import scxml from "./scxml/index.mjs";

export default function getRenderFunction(pOutputType) {
  const lOutputtype2Renderfunction = {
    smcat,
    dot,
    svg: vector,
    eps: vector,
    ps: vector,
    ps2: vector,
    oldsvg: oldVector,
    oldps2: oldVector,
    oldeps: oldVector,
    scjson,
    scxml,
  };

  return has(lOutputtype2Renderfunction, pOutputType)
    ? lOutputtype2Renderfunction[pOutputType]
    : (pX) => pX;
}
