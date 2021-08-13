import chalk from "chalk";
import indentString from "indent-string";
import wrapAnsi from "wrap-ansi";
import satisfies from "semver/functions/satisfies.js";

function wrapAndIndent(pString) {
  const lDogmaticMaxConsoleWidth = 78;
  const lDefaultIndent = 2;

  const MAX_WIDTH = lDogmaticMaxConsoleWidth - lDefaultIndent;

  return indentString(wrapAnsi(pString, MAX_WIDTH), lDefaultIndent);
}

export default (pNodeVersion) => {
  const lDescription =
    "Write beautiful state charts - https://github.com/sverweij/state-machine-cat";
  const lNode12Warning =
    "When you output svg on node >=12, you might see " +
    `${chalk.italic(
      "'Invalid asm.js: Function definition doesn't match use'"
    )}. ` +
    "It's harmless. See " +
    `https://github.com/sverweij/state-machine-cat/blob/develop/docs/faq.md#q-im-on-node-12-and-get-a-warning-when-i-convert-to-svg-with-the-cli-whats-up`;

  return indentString(
    satisfies(pNodeVersion, ">=12")
      ? `${lDescription}\n\n${wrapAndIndent(chalk.dim(lNode12Warning))}`
      : lDescription
  );
};
