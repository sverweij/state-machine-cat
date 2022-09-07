import dotToSvgJs from "viz.js";
import indentString from "indent-string";
import wrapAnsi from "wrap-ansi";
import chalk from "chalk";
import options from "../../options.mjs";
import ast2dot from "../dot/index.mjs";
import dotToVectorNative from "./dot-to-vector-native.mjs";

const DEFAULT_INDENT = 2;
const DOGMATIC_CONSOLE_WIDTH = 78;
const VIZ_JS_UNSUPPORTED_OUTPUT_FORMATS = ["pdf", "png"];

export default (pAST, pOptions) => {
  const lDotProgram = ast2dot(pAST, pOptions);
  const lDotOptions = {
    engine: options.getOptionValue(pOptions, "engine"),
    format: options.getOptionValue(pOptions, "outputType"),
  };

  if (dotToVectorNative.isAvailable(pOptions)) {
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
