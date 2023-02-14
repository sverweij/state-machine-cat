import {
  IRenderOptions,
  StringRenderFunctionType,
} from "types/state-machine-cat.js";
// @ts-expect-error tsc mumbles about missing type definitions and/ or erroneously imports index.d.ts - which indeed is not a module ...
import viz from "viz.js";
import options from "../../options.mjs";
import ast2dot from "../dot/index.mjs";

const OUTPUT_TYPE2FORMAT: { [name: string]: string } = {
  oldsvg: "svg",
  oldps2: "ps2",
  oldeps: "eps",
};

const renderVectorWithViz: StringRenderFunctionType = (
  pStateMachine,
  pOptions
) =>
  viz(ast2dot(pStateMachine, pOptions), {
    engine: options.getOptionValue(pOptions as IRenderOptions, "engine"),
    format:
      OUTPUT_TYPE2FORMAT[
        options.getOptionValue(
          pOptions as IRenderOptions,
          "outputType"
        ) as string
      ] || "svg",
  });

export default renderVectorWithViz;
