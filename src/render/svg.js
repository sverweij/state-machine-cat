/* global Viz */
const viz_lib = require('viz.js');
const options = require('../options');
const ast2dot = require('./dot');

const viz = typeof viz_lib === 'function' ? viz_lib : Viz;

module.exports = (pAST, pOptions) => viz(
    ast2dot(pAST, pOptions),
    {engine: options.getOptionValue(pOptions, "engine")}
);
