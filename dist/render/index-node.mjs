import smcatRendererAsImported from "./smcat.mjs";
import renderDot from "./ndot/index.mjs";
import vector from "./vector/vector-native-dot-with-fallback.mjs";
import oldVector from "./vector/vector-with-wasm.mjs";
import scjson from "./scjson/index.mjs";
import scxml from "./scxml/index.mjs";
const smcat = smcatRendererAsImported;
export default function getRenderFunction(pOutputType) {
	const lOutputType2RenderFunctionMap = new Map([
		["smcat", smcat],
		["dot", renderDot],
		["svg", vector],
		["dot", renderDot],
		["eps", vector],
		["ps", vector],
		["ps2", vector],
		["oldsvg", oldVector],
		["oldps2", oldVector],
		["oldeps", oldVector],
		["pdf", vector],
		["png", vector],
		["scjson", scjson],
		["scxml", scxml],
	]);
	return lOutputType2RenderFunctionMap.get(pOutputType) ?? ((pX) => pX);
}
