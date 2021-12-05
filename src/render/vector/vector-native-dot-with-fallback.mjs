import dotToSvgJs from "viz.js";
import indentString from "indent-string";
import wrapAnsi from "wrap-ansi";
// seems eslint-plugin-import and eslint-plugin-node can't handle exports
// fields yet. No man overboard not checking against this, because dependency-cruiser
// will also find them
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import chalk from "chalk";
import options from "../../options.mjs";
import ast2dot from "../dot/index.mjs";
import dotToVectorNative from "./dot-to-vector-native.mjs";

const DEFAULT_INDENT = 2;
const DOGMATIC_CONSOLE_WIDTH = 78;
export default (pAST, pOptions) => {
  const lDotProgram = ast2dot(pAST, pOptions);
  const lDotOptions = {
    engine: options.getOptionValue(pOptions, "engine"),
    format: options.getOptionValue(pOptions, "outputType"),
  };

  if (dotToVectorNative.isAvailable(pOptions)) {
    return dotToVectorNative.convert(lDotProgram, lDotOptions);
  } else {
    process.stderr.write(
      indentString(
        wrapAnsi(
          `\n${chalk.yellow(
            "warning:"
          )} GraphViz 'dot' executable not found. Falling back to svg.js.\n\n` +
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
