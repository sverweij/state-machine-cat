// eslint-disable-next-line unicorn/prefer-node-protocol
import options from "./options.js";
import parse from "./parse/index.js";
import desugar from "./transform/desugar.js";
import getRenderFunction from "./render/index.js";
import { version as packageVersion } from "./version.js";

/**
 * Translates the input script to an outputscript.
 *
 * @param  {string} pScript     The script to translate
 * @param  {object} pOptions    options influencing parsing & rendering.
 *                              See below for the complete list.
 * @return {string|void}        nothing if a callback was passed, the
 *                              string with the rendered content if
 *                              no callback was passed and no error was found
 * @throws {Error}              if an error occurred and no callback
 *                              function was passed: the error
 *
 * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
 *
 */
function render(pScript, pOptions) {
  const lAST = parse.getAST(pScript, pOptions);
  const lDesugar = options.getOptionValue(pOptions, "desugar");

  return getRenderFunction(options.getOptionValue(pOptions, "outputType"))(
    lDesugar ? desugar(lAST) : lAST,
    pOptions
  );
}

/**
 * The current (semver compliant) version number string of
 * state machine cat
 *
 * @type {string}
 */
const version = packageVersion;

/**
 * An object with for each of the options you can pass to
 * the render function
 * - the default value
 * - the possible values in an array of objects, each of which
 *   has the properties:
 *   - name: the value
 *
 */
const getAllowedValues = options.getAllowedValues;

export default {
  render,
  version,
  getAllowedValues,
};
