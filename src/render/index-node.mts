import type {
  OutputType,
  RenderFunctionType,
} from "types/state-machine-cat.mjs";

const OUTPUT_TYPE2RENDER_MODULE: Map<string, string> = new Map([
  ["smcat", "./smcat.mjs"],
  ["dot", "./dot/index.mjs"],
  ["svg", "./vector/vector-native-dot-with-fallback.mjs"],
  ["eps", "./vector/vector-native-dot-with-fallback.mjs"],
  ["ps", "./vector/vector-native-dot-with-fallback.mjs"],
  ["ps2", "./vector/vector-native-dot-with-fallback.mjs"],
  ["oldsvg", "./vector/vector-with-wasm.mjs"],
  ["oldps2", "./vector/vector-with-wasm.mjs"],
  ["oldeps", "./vector/vector-with-wasm.mjs"],
  ["pdf", "./vector/vector-native-dot-with-fallback.mjs"],
  ["png", "./vector/vector-native-dot-with-fallback.mjs"],
  ["scjson", "./scjson/index.mjs"],
  ["scxml", "./scxml/index.mjs"],
]);

export default async function getRenderFunction(
  pOutputType: OutputType,
): Promise<RenderFunctionType> {
  const lModulePath = OUTPUT_TYPE2RENDER_MODULE.get(pOutputType);

  if (lModulePath) {
    const lImportedModule = await import(lModulePath);
    return lImportedModule.default;
  }
  return (pX) => pX;
}
