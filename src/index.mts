/* eslint-disable budapestian/global-constant-pattern */
import type {
  IAllowedValues,
  IRenderOptions,
  IStateMachine,
  OutputType,
} from "types/state-machine-cat.mjs";
import options from "./options.mjs";
import parse from "./parse/index.mjs";
import getRenderFunction from "./render/index.mjs";
import { version as _version } from "./version.mjs";

let gDesugarModule: typeof import("./transform/desugar.mjs") | null = null;

async function desugar(pStateMachine: IStateMachine): Promise<IStateMachine> {
  if (!gDesugarModule) {
    // When used concurrently, this might lead to the situation that the desugar
    // module is imported multiple times. This beats the guarantee the module
    // is loaded _every_ time, though, so we accept that.
    // eslint-disable-next-line require-atomic-updates
    gDesugarModule = await import("./transform/desugar.mjs");
  }
  const lDesugarFunction = gDesugarModule.default;
  return lDesugarFunction(pStateMachine);
}

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
  const lOptions = pOptions ?? {};
  const lStateMachine = await parse.getAST(pScript, lOptions);
  const lDesugar = options.getOptionValue(lOptions, "desugar");

  const lRenderFunction = await getRenderFunction(
    options.getOptionValue(lOptions, "outputType") as OutputType,
  );

  return lRenderFunction(
    lDesugar ? await desugar(lStateMachine) : lStateMachine,
    lOptions,
  );
}

/**
 * The current (semver compliant) version number string of
 * state machine cat
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
  return options.getAllowedValues();
}
