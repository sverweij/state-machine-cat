let gSmCatModule = null;
let gDotModule = null;
let gSVGModule = null;
let gSCJSONModule = null;
let gSCXMLModule = null;
export default async function getRenderFunction(pOutputType) {
	switch (pOutputType) {
		case "smcat": {
			if (!gSmCatModule) {
				gSmCatModule = await import("./smcat.mjs");
			}
			return gSmCatModule.default;
		}
		case "dot": {
			if (!gDotModule) {
				gDotModule = await import("./dot/index.mjs");
			}
			return gDotModule.default;
		}
		case "svg":
		case "oldsvg": {
			if (!gSVGModule) {
				gSVGModule = await import("./vector/vector-with-wasm.mjs");
			}
			return gSVGModule.default;
		}
		case "scjson": {
			if (!gSCJSONModule) {
				gSCJSONModule = await import("./scjson/index.mjs");
			}
			return gSCJSONModule.default;
		}
		case "scxml": {
			if (!gSCXMLModule) {
				gSCXMLModule = await import("./scxml/index.mjs");
			}
			return gSCXMLModule.default;
		}
		default:
			return (pX) => pX;
	}
}
