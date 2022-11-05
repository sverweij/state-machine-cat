// @ts-check
import Ajv from "ajv";
import options from "../options.mjs";
import { parse as parseSmCat } from "./smcat/smcat-parser.mjs";
import { parse as parseSCXML } from "./scxml/index.mjs";
import $schema from "./smcat-ast.schema.mjs";

const ajv = new Ajv();

/**
 * @param {typeof $schema} pSchema
 * @param {any} pObject
 * @throws {Error}
 */
function validateAgainstSchema(pSchema, pObject) {
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
  getAST(pScript, pOptions) {
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
