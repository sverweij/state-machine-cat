/* eslint-disable security/detect-object-injection */
const smcat = require("./smcat");
const dot = require("./dot");
const svg = require("./svg");
const scjson = require("./scjson");
const scxml = require("./scxml");

module.exports = function getRenderFunction(pOutputType) {
  const OUTPUTTYPE2RENDERFUNCTION = {
    smcat,
    dot,
    svg,
    scjson,
    scxml
  };

  return OUTPUTTYPE2RENDERFUNCTION.hasOwnProperty(pOutputType)
    ? OUTPUTTYPE2RENDERFUNCTION[pOutputType]
    : pX => pX;
};
