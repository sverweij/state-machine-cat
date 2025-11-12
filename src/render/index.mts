/* eslint-disable require-atomic-updates */
import type {
  OutputType,
  RenderFunctionType,
} from "types/state-machine-cat.mjs";

type RenderModuleType = {
  default: RenderFunctionType;
};

let gSmCatModule: RenderModuleType | null = null;
let gDotModule: RenderModuleType | null = null;
let gSVGModule: RenderModuleType | null = null;
let gSCJSONModule: RenderModuleType | null = null;
let gSCXMLModule: RenderModuleType | null = null;

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
