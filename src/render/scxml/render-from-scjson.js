const Handlebars = require("handlebars/dist/handlebars.runtime.js");

// eslint-disable-next-line import/no-unassigned-import
require("./scxml.template.js");
// eslint-disable-next-line import/no-unassigned-import
require("./scxml.states.template.js");

Handlebars.registerPartial(
  "scxml.states.template.hbs",
  Handlebars.templates["scxml.states.template.hbs"]
);

module.exports = function renderSCXML(pSCJSON) {
  return Handlebars.templates["scxml.template.hbs"](pSCJSON);
};
