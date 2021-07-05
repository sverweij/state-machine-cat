/* eslint-disable security/detect-object-injection */
const has = require("lodash.has");
const smcat = require("./smcat/index.cjs");
const dot = require("./dot/index.cjs");
const svg = require("./vector/vector-with-viz-js.cjs");
const scjson = require("./scjson/index.cjs");
const scxml = require("./scxml/index.cjs");

module.exports = function getRenderFunction(pOutputType) {
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
};
