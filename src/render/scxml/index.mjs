// @ts-check
import ast2scjson from "../scjson/index.mjs";
import renderFomSCJSON from "./render-from-scjson.js";

/** @type {import("../../../types/state-machine-cat.js").StringRenderFunctionType} */
export default function renderSCXML(pStateMachine) {
  return renderFomSCJSON(ast2scjson(pStateMachine, null));
}
