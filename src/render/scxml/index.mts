import type { StringRenderFunctionType } from "types/state-machine-cat.js";
import ast2scjson from "../scjson/index.mjs";
import renderFomSCJSON from "./render-from-scjson.js";

const renderSCXML: StringRenderFunctionType = (pStateMachine) =>
  renderFomSCJSON(ast2scjson(pStateMachine));

export default renderSCXML;
