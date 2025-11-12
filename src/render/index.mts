import type {
  OutputType,
  RenderFunctionType,
} from "types/state-machine-cat.mjs";

let gSmCatModule = null;
let gDotModule = null;
let gSVGModule = null;
let gSCJSONModule = null;
let gSCXMLModule = null;

// eslint-disable-next-line complexity
export default async function getRenderFunction(
  pOutputType: OutputType,
): Promise<RenderFunctionType> {
  /*
    This uses a switch statement rather than a map (as in  "./index-node.mts")
    because dynamic imports with variable names (a.o.t. explicit strings)
    don't work with bundlers as they only do static analysis.
  */
  switch (pOutputType) {
    case "smcat": {
      gSmCatModule = await import("./smcat.mjs");
      return gSmCatModule.default;
    }
    case "dot": {
      gDotModule = await import("./dot/index.mjs");
      return gDotModule.default;
    }
    case "svg":
    case "oldsvg": {
      gSVGModule = await import("./vector/vector-with-wasm.mjs");
      return gSVGModule.default;
    }
    case "scjson": {
      gSCJSONModule = await import("./scjson/index.mjs");
      return gSCJSONModule.default;
    }
    case "scxml": {
      gSCXMLModule = await import("./scxml/index.mjs");
      return gSCXMLModule.default;
    }
    default:
      return (pX) => pX;
  }
}
