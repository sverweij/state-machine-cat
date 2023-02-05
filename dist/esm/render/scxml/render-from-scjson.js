"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Handlebars = require("handlebars/dist/handlebars.runtime.js");
require("./scxml.template.js");
require("./scxml.states.template.js");
Handlebars.registerPartial("scxml.states.template.hbs", Handlebars.templates["scxml.states.template.hbs"]);
module.exports = function renderSCXML(pSCJSON) {
    return Handlebars.templates["scxml.template.hbs"](pSCJSON);
};
