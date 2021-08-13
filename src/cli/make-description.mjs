import chalk from "chalk";
import indentString from "indent-string";
import wrapAnsi from "wrap-ansi";
import dotToVectorNative from "../render/vector/dot-to-vector-native.mjs";

function wrapAndIndent(pString) {
  const lDogmaticMaxConsoleWidth = 78;
  const lDefaultIndent = 2;

  const MAX_WIDTH = lDogmaticMaxConsoleWidth - lDefaultIndent;

  return indentString(wrapAnsi(pString, MAX_WIDTH), lDefaultIndent);
}

export default (pDotIsAvailable = dotToVectorNative.isAvailable({})) => {
  const lDescription =
    "Write beautiful state charts - https://github.com/sverweij/state-machine-cat";
  const lNode12Warning =
    "When you want to output svg and the native GraphViz isn't installed, " +
    "state-machine-cat will fall back to viz.js and you might see " +
    `${chalk.italic(
      "'Invalid asm.js: Function definition doesn't match use'"
    )}. ` +
    "It's harmless and your svg will come out ok. See " +
    `https://github.com/sverweij/state-machine-cat/blob/develop/docs/faq.md#viz`;

  return indentString(
    pDotIsAvailable
      ? lDescription
      : `${lDescription}\n\n${wrapAndIndent(chalk.dim(lNode12Warning))}`
  );
};
