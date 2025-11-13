import type {
  IAllowedValues,
  IRenderOptions,
  IStateMachine,
  OutputType,
} from "types/state-machine-cat.mjs";
import {
  getAllowedValues as _getAllowedValues,
  getOptionValue,
} from "./options.mjs";
import { getAST } from "./parse/index.mjs";
import desugar from "./transform/desugar.mjs";
import getRenderFunction from "./render/index-node.mjs";
import { version as _version } from "./version.mjs";

/**
 * Translates the input script to an output-script.
 *
 * @throws {Error}              if an error occurred and no callback
 *                              function was passed: the error
 *
 * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
 *
 */
export async function render(
  pScript: string | IStateMachine,
  pOptions: IRenderOptions,
): Promise<string> {
  const lStateMachine = await getAST(pScript, pOptions);
  const lDesugar = getOptionValue(pOptions, "desugar");

  const lRenderFunction = await getRenderFunction(
    getOptionValue(pOptions, "outputType") as OutputType,
  );
  return lRenderFunction(
    lDesugar ? desugar(lStateMachine) : lStateMachine,
    pOptions,
  );
}

/**
 * The current (semver compliant) version number string of
 * state machine cat
 *
 */
export const version: string = _version;

/**
 * Returns an object with each of the options you can pass to
 * the render function
 * - the default value
 * - the possible values in an array of objects, each of which
 *   has the properties:
 *   - name: the value
 */
export function getAllowedValues(): IAllowedValues {
  return _getAllowedValues();
}
