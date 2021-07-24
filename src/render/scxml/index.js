import ast2scjson from "../scjson/index.js";
import renderFomSCJSON from "./render-from-scjson.cjs";

export default function renderSCXML(pStateMachine) {
  return renderFomSCJSON(ast2scjson(pStateMachine));
}
