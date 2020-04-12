const chalk = require("chalk");
const indentString = require("indent-string");
const wrapAnsi = require("wrap-ansi");
const semver = require("semver");

function wrapAndIndent(pString) {
  const DOGMATIC_MAX_CONSOLE_WIDTH = 78;
  const DEFAULT_INDENT = 2;

  const MAX_WIDTH = DOGMATIC_MAX_CONSOLE_WIDTH - DEFAULT_INDENT;

  return indentString(wrapAnsi(pString, MAX_WIDTH), DEFAULT_INDENT);
}

module.exports = (pNodeVersion) => {
  const lDescription =
    "Write beautiful state charts - https://github.com/sverweij/state-machine-cat";
  const lNode12Warning =
    "When you output svg on node >=12, you might see " +
    `${chalk.italic(
      "'Invalid asm.js: Function definition doesn't match use'"
    )}. ` +
    "It's harmless. See " +
    `https://github.com/sverweij/state-machine-cat/docs/FAQ.md#node12`;

  return indentString(
    semver.satisfies(pNodeVersion, ">=12")
      ? `${lDescription}\n\n${wrapAndIndent(chalk.dim(lNode12Warning))}`
      : lDescription
  );
};
