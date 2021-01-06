const dotToSvgJs = require("viz.js");
const indentString = require("indent-string");
const wrapAnsi = require("wrap-ansi");
const chalk = require("chalk");
const options = require("../../options");
const ast2dot = require("../dot");
const dotToSvgNative = require("./dot-to-vector-native");

const DEFAULT_INDENT = 2;
const DOGMATIC_CONSOLE_WIDTH = 78;
module.exports = (pAST, pOptions) => {
  const lDotProgram = ast2dot(pAST, pOptions);
  const lDotOptions = {
    engine: options.getOptionValue(pOptions, "engine"),
    format: options.getOptionValue(pOptions, "outputType"),
  };

  if (dotToSvgNative.isAvailable(pOptions)) {
    return dotToSvgNative.convert(lDotProgram, lDotOptions);
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
// file deepcode ignore ExpectsObjectDislikesPrimitive: (false positive: deepcode erroneously stipulates the first argument of wrapansi should be an array, while it should be a string (as done here))
// file deepcode ignore ExpectsArray: (false positive: deepcode erroneously stipulates the first argument of wrapansi should be an array, while it should be a string (as done here))
