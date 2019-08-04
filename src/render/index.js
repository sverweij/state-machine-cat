const smcat = require("./smcat");
const dot = require("./dot");
const svg = require("./svg");
const html = require("./html");
const scjson = require("./scjson");
const scxml = require("./scxml");
const xmi = require("./xmi");

module.exports = function getRenderFunction(pOutputType) {
  const OUTPUTTYPE2RENDERFUNCTION = {
    smcat,
    dot,
    svg,
    html,
    scjson,
    scxml,
    xmi
  };

  return OUTPUTTYPE2RENDERFUNCTION.hasOwnProperty(pOutputType)
    ? OUTPUTTYPE2RENDERFUNCTION[pOutputType]
    : x => x;
};
