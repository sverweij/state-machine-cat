// @ts-expect-error tsc mumbles about missing type definitions and/ or erroneously imports index.d.ts - which indeed is not a module ...
import dotToSvgJs from "viz.js";
import indentString from "indent-string";
import wrapAnsi from "wrap-ansi";
import chalk from "chalk";
import {
  IRenderOptions,
  OutputType,
  StringRenderFunctionType,
} from "types/state-machine-cat.js";
import options from "../../options.mjs";
import ast2dot from "../dot/index.mjs";
import dotToVectorNative, {
  DotToVectorNativeOptionsType,
} from "./dot-to-vector-native.mjs";

const DEFAULT_INDENT = 2;
const DOGMATIC_CONSOLE_WIDTH = 78;
const VIZ_JS_UNSUPPORTED_OUTPUT_FORMATS = ["pdf", "png"];

const renderVector: StringRenderFunctionType = (pStateMachine, pOptions) => {
  const lDotProgram = ast2dot(pStateMachine, pOptions);
  const lDotOptions = {
    engine: options.getOptionValue(
      pOptions as IRenderOptions,
      "engine"
    ) as string,
    format: options.getOptionValue(
      pOptions as IRenderOptions,
      "outputType"
    ) as OutputType,
  };

  if (dotToVectorNative.isAvailable(pOptions as DotToVectorNativeOptionsType)) {
    return dotToVectorNative.convert(lDotProgram, lDotOptions);
  } else {
    if (VIZ_JS_UNSUPPORTED_OUTPUT_FORMATS.includes(lDotOptions.format)) {
      throw new Error(
        "GraphViz 'dot' executable not found. Falling back to viz.js.\n\n" +
          "'viz.js' doesn't support the 'pdf' and 'png' output formats. Either " +
          "select a format that it does support or install GraphViz " +
          "(recommended), which has support for both formats.\n"
      );
    }

    process.stderr.write(
      indentString(
        wrapAnsi(
          `\n${chalk.yellow(
            "warning:"
          )} GraphViz 'dot' executable not found. Falling back to viz.js.\n\n` +
            "On node >=12 this fallback will trigger a warning from the " +
            `node runtime:\n${chalk.italic(
              "Invalid asm.js: Function definition doesn't match use"
            )}.\n` +
            "It's harmless and the svg will generate just fine. However, if " +
            "you want to avoid the warning install GraphViz and make sure it's " +
            "available in your path." +
            "\n\n",
          DOGMATIC_CONSOLE_WIDTH
        ),
        DEFAULT_INDENT
      )
    );

    return dotToSvgJs(lDotProgram, lDotOptions);
  }
};

export default renderVector;
