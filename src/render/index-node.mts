import type {
  OutputType,
  RenderFunctionType,
  StringRenderFunctionType,
} from "types/state-machine-cat.mjs";
import smcatRendererAsImported from "./smcat.mjs";
import renderDot from "./ndot/index.mjs";
import vector from "./vector/vector-native-dot-with-fallback.mjs";
import oldVector from "./vector/vector-with-wasm.mjs";
import scjson from "./scjson/index.mjs";
import scxml from "./scxml/index.mjs";

// tsc doesn't recognize the function that smcat/index.js exports as
// StringRenderFunctionType, so we hack around it
const smcat = smcatRendererAsImported as StringRenderFunctionType;

export default function getRenderFunction(
  pOutputType: OutputType,
): RenderFunctionType {
  const lOutputType2RenderFunctionMap: Map<string, RenderFunctionType> =
    // @ts-expect-error - now renderDot is typed, typescript seems to have an issue
    // with it. Works perfectly fine, though, so we're ignoring it for now.
    new Map([
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
