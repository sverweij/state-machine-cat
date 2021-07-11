import Handlebars from "handlebars/dist/handlebars.runtime.js";
import ast2scjson from "../scjson/index.js";

// eslint-disable-next-line no-unused-vars
import _unused_dummy_to_enable_side_effects from "./scxml.template.cjs";
// eslint-disable-next-line no-unused-vars
import _unused_dummy_to_enable_side_effects_states from "./scxml.states.template.cjs";

Handlebars.registerPartial(
  "scxml.states.template.hbs",
  Handlebars.templates["scxml.states.template.hbs"]
);

export default (pStateMachine) =>
  Handlebars.templates["scxml.template.hbs"](ast2scjson(pStateMachine));
