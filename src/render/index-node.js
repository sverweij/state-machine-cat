/* eslint-disable security/detect-object-injection */
const has = require("lodash.has");
const smcat = require("./smcat");
const dot = require("./dot");
const svg = require("./svg/svg-native-dot-with-fallback");
const oldsvg = require("./svg/svg-with-viz-js");
const scjson = require("./scjson");
const scxml = require("./scxml");

module.exports = function getRenderFunction(pOutputType) {
  const lOutputtype2Renderfunction = {
    smcat,
    dot,
    svg,
    oldsvg,
    scjson,
    scxml,
  };

  return has(lOutputtype2Renderfunction, pOutputType)
    ? lOutputtype2Renderfunction[pOutputType]
    : (pX) => pX;
};
