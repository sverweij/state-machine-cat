import options from "./options.js";
import parse from "./parse/index.js";
import desugar from "./transform/desugar.js";
import getRenderFunction from "./render/index.js";
import { version } from "./version.js";

export default {
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
  render(pScript, pOptions) {
    const lAST = parse.getAST(pScript, pOptions);
    const lDesugar = options.getOptionValue(pOptions, "desugar");

    return getRenderFunction(options.getOptionValue(pOptions, "outputType"))(
      lDesugar ? desugar(lAST) : lAST,
      pOptions
    );
  },

  /**
   * The current (semver compliant) version number string of
   * state machine cat
   *
   * @type {string}
   */
  version,

  /**
   * Returns an object with each of the options you can pass to
   * the render function
   * - the default value
   * - the possible values in an array of objects, each of which
   *   has the properties:
   *   - name: the value
   *
   */
  getAllowedValues() {
    return options.getAllowedValues();
  },
};
