import type {
  IAllowedValues,
  IRenderOptions,
  IStateMachine,
  OutputType,
} from "types/state-machine-cat.js";
import options from "./options.mjs";
import parse from "./parse/index.mjs";
import desugar from "./transform/desugar.mjs";
import getRenderFunction from "./render/index-node.mjs";
import { version } from "./version.mjs";

export default {
  /**
   * Translates the input script to an output-script.
   *
   * @throws {Error}              if an error occurred and no callback
   *                              function was passed: the error
   *
   * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
   *
   */
  render(pScript: string | IStateMachine, pOptions: IRenderOptions) {
    const lStateMachine = parse.getAST(pScript, pOptions);
    const lDesugar = options.getOptionValue(pOptions, "desugar");

    return getRenderFunction(
      options.getOptionValue(pOptions, "outputType") as OutputType
    )(lDesugar ? desugar(lStateMachine) : lStateMachine, pOptions);
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
   */
  getAllowedValues(): IAllowedValues {
    return options.getAllowedValues();
  },
};
