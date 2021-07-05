const Handlebars = require("handlebars/dist/handlebars.runtime");
const ast2scjson = require("../scjson/index.cjs");

/* eslint import/no-unassigned-import: 0 */
require("./scxml.template.cjs");
require("./scxml.states.template.cjs");

Handlebars.registerPartial(
  "scxml.states.template.hbs",
  Handlebars.templates["scxml.states.template.hbs"]
);

module.exports = (pStateMachine) =>
  Handlebars.templates["scxml.template.hbs"](ast2scjson(pStateMachine));
