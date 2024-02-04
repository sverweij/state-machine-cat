import type {
  IRenderOptions,
  StringRenderFunctionType,
} from "types/state-machine-cat.mjs";
import { type Engine, type Format, Graphviz } from "@hpcc-js/wasm/graphviz";
import options from "../../options.mjs";
import ast2dot from "../dot/index.mjs";

const OUTPUT_TYPE2FORMAT: { [name: string]: string } = {
  oldsvg: "svg",
  oldps2: "ps2",
  oldeps: "eps",
};
const gGraphViz = await Graphviz.load();

function getFormat(pOptions?: IRenderOptions): Format {
  return (OUTPUT_TYPE2FORMAT[
    options.getOptionValue(pOptions as IRenderOptions, "outputType") as string
  ] || "svg") as Format;
}

function getEngine(pOptions?: IRenderOptions): Engine {
  return options.getOptionValue(pOptions as IRenderOptions, "engine") as Engine;
}

const renderVectorWithWasm: StringRenderFunctionType = (
  pStateMachine,
  pOptions,
) =>
  gGraphViz.layout(
    ast2dot(pStateMachine, pOptions),
    getFormat(pOptions),
    getEngine(pOptions),
  );

export default renderVectorWithWasm;
