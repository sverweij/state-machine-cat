import { Graphviz } from "@hpcc-js/wasm/graphviz";
import indentString from "indent-string";
import wrapAnsi from "wrap-ansi";
import chalk from "chalk";
import options from "../../options.mjs";
import ast2dot from "../dot/index.mjs";
import dotToVectorNative from "./dot-to-vector-native.mjs";
const DEFAULT_INDENT = 2;
const DOGMATIC_CONSOLE_WIDTH = 78;
const VIZ_JS_UNSUPPORTED_OUTPUT_FORMATS = ["pdf", "png"];
const gGraphViz = await Graphviz.load();
const renderVector = (pStateMachine, pOptions) => {
    const lDotProgram = ast2dot(pStateMachine, pOptions);
    const lDotOptions = {
        engine: options.getOptionValue(pOptions, "engine"),
        format: options.getOptionValue(pOptions, "outputType"),
    };
    if (dotToVectorNative.isAvailable(pOptions)) {
        return dotToVectorNative.convert(lDotProgram, lDotOptions);
    }
    else {
        if (VIZ_JS_UNSUPPORTED_OUTPUT_FORMATS.includes(lDotOptions.format)) {
            throw new Error("GraphViz 'dot' executable not found. Falling back to wasm.\n\n" +
                "The compiled-to-wasm version of GraphViz we use doesn't support the " +
                "'pdf' and 'png' output formats. Either select a format that it does " +
                "support or install GraphViz (recommended), which has support for " +
                "both formats.\n");
        }
        if (!pOptions?.noDotNativeWarning)
            process.stderr.write(indentString(wrapAnsi(`\n${chalk.yellow("warning:")} GraphViz 'dot' executable not found. Falling back to wasm.\n\n`, DOGMATIC_CONSOLE_WIDTH), DEFAULT_INDENT));
        return gGraphViz.layout(lDotProgram, lDotOptions.format, lDotOptions.engine);
    }
};
export default renderVector;
