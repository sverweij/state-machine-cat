/* eslint-disable security/detect-object-injection */
import has from "lodash.has";
import smcat from "./smcat/index.js";
import dot from "./dot/index.js";
import svg from "./vector/vector-with-viz-js.js";
import scjson from "./scjson/index.js";
import scxml from "./scxml/index.js";

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
