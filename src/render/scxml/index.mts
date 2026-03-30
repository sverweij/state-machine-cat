import ast2scjson from "../scjson/index.mjs";
import renderFomSCJSON from "./render-from-scjson.mjs";
import type { StringRenderFunctionType } from "#types/state-machine-cat.mjs";

const renderSCXML: StringRenderFunctionType = (pStateMachine) =>
  renderFomSCJSON(ast2scjson(pStateMachine));

export default renderSCXML;
