/* eslint-disable security/detect-object-injection */
const has = require("lodash.has");
const smcat = require("./smcat/index.cjs");
const dot = require("./dot/index.cjs");
const vector = require("./vector/vector-native-dot-with-fallback.cjs");
const oldVector = require("./vector/vector-with-viz-js.cjs");
const scjson = require("./scjson/index.cjs");
const scxml = require("./scxml/index.cjs");

module.exports = function getRenderFunction(pOutputType) {
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
};
