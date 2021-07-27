/* eslint-disable security/detect-object-injection */
import has from "lodash.has";
import smcat from "./smcat/index.js";
import dot from "./dot/index.mjs";
import svg from "./vector/vector-with-viz-js.mjs";
import scjson from "./scjson/index.mjs";
import scxml from "./scxml/index.mjs";

export default function getRenderFunction(pOutputType) {
  const lOutputtype2Renderfunction = {
    smcat,
    dot,
    svg,
    oldsvg: svg,
    scjson,
    scxml,
  };

  return has(lOutputtype2Renderfunction, pOutputType)
    ? lOutputtype2Renderfunction[pOutputType]
    : (pX) => pX;
}
