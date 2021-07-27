import Ajv from "ajv";
import options from "../options.mjs";
import { parse as parseSmCat } from "./smcat/smcat-parser.mjs";
import { parse as parseSCXML } from "./scxml/index.mjs";
import $schema from "./smcat-ast.schema.mjs";

const ajv = new Ajv();

function validateAgainstSchema(pSchema, pObject) {
  if (!ajv.validate(pSchema, pObject)) {
    throw new Error(
      `The provided JSON is not a valid state-machine-cat AST: ${ajv.errorsText()}.\n`
    );
  }
}

export default {
  getAST(pScript, pOptions) {
    let lReturnValue = pScript;

    if (options.getOptionValue(pOptions, "inputType") === "smcat") {
      lReturnValue = parseSmCat(pScript);
    } else if (options.getOptionValue(pOptions, "inputType") === "scxml") {
      lReturnValue = parseSCXML(pScript);
    } else if (typeof pScript === "string") {
      // json
      lReturnValue = JSON.parse(pScript);
    }

    validateAgainstSchema($schema, lReturnValue);

    return lReturnValue;
  },
};
