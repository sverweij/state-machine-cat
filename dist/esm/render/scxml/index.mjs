import ast2scjson from "../scjson/index.mjs";
import renderFomSCJSON from "./render-from-scjson.js";
const renderSCXML = (pStateMachine) => renderFomSCJSON(ast2scjson(pStateMachine));
export default renderSCXML;
