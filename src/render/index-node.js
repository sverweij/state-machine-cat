/* eslint-disable security/detect-object-injection */
const has = require("lodash.has");
const smcat = require("./smcat");
const dot = require("./dot");
const vector = require("./vector/vector-native-dot-with-fallback");
const oldVector = require("./vector/vector-with-viz-js");
const scjson = require("./scjson");
const scxml = require("./scxml");

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
