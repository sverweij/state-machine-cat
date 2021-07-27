import ast2scjson from "../scjson/index.mjs";
import renderFomSCJSON from "./render-from-scjson.js";

export default function renderSCXML(pStateMachine) {
  return renderFomSCJSON(ast2scjson(pStateMachine));
}
