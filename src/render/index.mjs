/* eslint-disable security/detect-object-injection */
import has from "lodash/has.js";
import smcat from "./smcat/index.js";
import dot from "./dot/index.mjs";
import svg from "./vector/vector-with-viz-js.mjs";
import scjson from "./scjson/index.mjs";
import scxml from "./scxml/index.mjs";

export default function getRenderFunction(pOutputType) {
  const lOutputType2RenderFunction = {
    smcat,
    dot,
    svg,
    oldsvg: svg,
    scjson,
    scxml,
  };

  return has(lOutputType2RenderFunction, pOutputType)
    ? lOutputType2RenderFunction[pOutputType]
    : (pX) => pX;
}
