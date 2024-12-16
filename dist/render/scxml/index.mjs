import ast2scjson from "../scjson/index.mjs";
import renderFomSCJSON from "./render-from-scjson.mjs";
const renderSCXML = (pStateMachine) =>
	renderFomSCJSON(ast2scjson(pStateMachine));
export default renderSCXML;
