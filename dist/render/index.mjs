import smcatRendererAsImported from "./smcat.mjs";
import renderDot from "./dot/index.mjs";
import svg from "./vector/vector-with-wasm.mjs";
import scjson from "./scjson/index.mjs";
import scxml from "./scxml/index.mjs";
const smcat = smcatRendererAsImported;
export default function getRenderFunction(pOutputType) {
	const lOutputType2RenderFunctionMap = new Map([
		["smcat", smcat],
		["dot", renderDot],
		["svg", svg],
		["oldsvg", svg],
		["scjson", scjson],
		["scxml", scxml],
	]);
	return lOutputType2RenderFunctionMap.get(pOutputType) ?? ((pX) => pX);
}
