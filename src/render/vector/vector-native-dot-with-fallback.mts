import { type Engine, type Format, Graphviz } from "@hpcc-js/wasm-graphviz";
import type {
  IRenderOptions,
  OutputType,
  StringRenderFunctionType,
} from "types/state-machine-cat.mjs";
import options from "../../options.mjs";
import ast2dot from "../dot/index.mjs";
import dotToVectorNative, {
  DotToVectorNativeOptionsType,
} from "./dot-to-vector-native.mjs";

const VIZ_JS_UNSUPPORTED_OUTPUT_FORMATS: string[] = ["pdf", "png"];
const gGraphViz = await Graphviz.load();

const renderVector: StringRenderFunctionType = (pStateMachine, pOptions) => {
  const lDotProgram = ast2dot(pStateMachine, pOptions);
  const lDotOptions = {
    engine: options.getOptionValue(
      pOptions as IRenderOptions,
      "engine",
    ) as string,
    format: options.getOptionValue(
      pOptions as IRenderOptions,
      "outputType",
    ) as OutputType,
  };

  if (dotToVectorNative.isAvailable(pOptions as DotToVectorNativeOptionsType)) {
    return dotToVectorNative.convert(lDotProgram, lDotOptions);
  } else {
    if (VIZ_JS_UNSUPPORTED_OUTPUT_FORMATS.includes(lDotOptions.format)) {
      throw new Error(
        "GraphViz 'dot' executable not found. Falling back to wasm.\n\n" +
          "The compiled-to-wasm version of GraphViz we use doesn't support the " +
          "'pdf' and 'png' output formats. Either select a format that it does " +
          "support or install GraphViz (recommended), which has support for " +
          "both formats.\n",
      );
    }

    if (!pOptions?.noDotNativeWarning)
      process.stderr.write(
        `  warning: GraphViz 'dot' executable not found. Falling back to wasm.\n\n`,
      );

    return gGraphViz.layout(
      lDotProgram,
      lDotOptions.format as Format,
      lDotOptions.engine as Engine,
    );
  }
};

export default renderVector;
