// @ts-check
import options from "./options.mjs";
import parse from "./parse/index.mjs";
import desugar from "./transform/desugar.mjs";
import getRenderFunction from "./render/index-node.mjs";
import { version } from "./version.mjs";

export default {
  /**
   * Translates the input script to an output-script.
   *
   * @param  {string|import("../types/state-machine-cat").IStateMachine} pScript
   *                              The script to translate
   * @param  {import("../types/state-machine-cat").IRenderOptions} pOptions
   *                              options influencing parsing & rendering.
   * @throws {Error}              if an error occurred and no callback
   *                              function was passed: the error
   *
   * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
   *
   */
  render(pScript, pOptions) {
    const lStateMachine = parse.getAST(pScript, pOptions);
    const lDesugar = options.getOptionValue(pOptions, "desugar");

    // @ts-expect-error should be cast to OutputTypeType - or the getOptionValue
    // function should be refactored to be more explicit in type it returns
    // when we ask for outputType
    return getRenderFunction(options.getOptionValue(pOptions, "outputType"))(
      lDesugar ? desugar(lStateMachine) : lStateMachine,
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
   * @returns {import("../types/state-machine-cat").IAllowedValues}
   */
  getAllowedValues() {
    return options.getAllowedValues();
  },
};
