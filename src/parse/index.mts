import Ajv from "ajv";
import type { IRenderOptions, IStateMachine } from "types/state-machine-cat.js";
import options from "../options.mjs";
import { parse as parseSmCat } from "./smcat/smcat-parser.mjs";
import { parse as parseSCXML } from "./scxml/index.mjs";
import $schema from "./smcat-ast.schema.mjs";

// @ts-expect-error using Ajv as a class/ constructor is as per the ajv documentation, but tsc seems to thing differently
const ajv = new Ajv();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateAgainstSchema(pSchema: typeof $schema, pObject: any): void {
  if (!ajv.validate(pSchema, pObject)) {
    throw new Error(
      `The provided JSON is not a valid state-machine-cat AST: ${ajv.errorsText()}.\n`
    );
  }
}

export default {
  /**
   * @param {string|import("../../types/state-machine-cat").IStateMachine} pScript
   * @param {import("../../types/state-machine-cat").IRenderOptions} pOptions
   * @returns {import("../../types/state-machine-cat").IStateMachine}
   */
  getAST(
    pScript: string | IStateMachine,
    pOptions: IRenderOptions
  ): IStateMachine {
    let lReturnValue = pScript;

    if (options.getOptionValue(pOptions, "inputType") === "smcat") {
      lReturnValue = parseSmCat(pScript);
    } else if (options.getOptionValue(pOptions, "inputType") === "scxml") {
      // @ts-expect-error inputType scxml => it's a string
      lReturnValue = parseSCXML(pScript);
    } else if (typeof pScript === "string") {
      // json
      lReturnValue = JSON.parse(pScript);
    }

    validateAgainstSchema($schema, lReturnValue);

    // @ts-expect-error by here lReturnValue is bound to be an IStateMachine
    return lReturnValue;
  },
};
