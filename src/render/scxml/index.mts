import type { StringRenderFunctionType } from "types/state-machine-cat.mjs";
import ast2scjson from "../scjson/index.mjs";
import renderFomSCJSON from "./render-from-scjson.mjs";

const renderSCXML: StringRenderFunctionType = (pStateMachine) =>
  renderFomSCJSON(ast2scjson(pStateMachine));

export default renderSCXML;
