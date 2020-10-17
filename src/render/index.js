/* eslint-disable security/detect-object-injection */
const smcat = require("./smcat");
const dot = require("./dot");
const svg = require("./svg");
const scjson = require("./scjson");
const scxml = require("./scxml");

module.exports = function getRenderFunction(pOutputType) {
  const lOutputtype2Renderfunction = {
    smcat,
    dot,
    svg,
    scjson,
    scxml,
  };

  return Object.prototype.hasOwnProperty.call(
    lOutputtype2Renderfunction,
    pOutputType
  )
    ? lOutputtype2Renderfunction[pOutputType]
    : (pX) => pX;
};
