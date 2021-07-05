const Ajv = require("ajv").default;
const options = require("../options.cjs");
const parser = require("./smcat/smcat-parser.cjs");
const scxml = require("./scxml/index.cjs");
const $schema = require("./smcat-ast.schema.json");

const ajv = new Ajv();

function validateAgainstSchema(pSchema, pObject) {
  if (!ajv.validate(pSchema, pObject)) {
    throw new Error(
      `The provided JSON is not a valid state-machine-cat AST: ${ajv.errorsText()}.\n`
    );
  }
}

function getAST(pScript, pOptions) {
  let lReturnValue = pScript;

  if (options.getOptionValue(pOptions, "inputType") === "smcat") {
    lReturnValue = parser.parse(pScript);
  } else if (options.getOptionValue(pOptions, "inputType") === "scxml") {
    lReturnValue = scxml.parse(pScript);
  } else if (typeof pScript === "string") {
    // json
    lReturnValue = JSON.parse(pScript);
  }

  validateAgainstSchema($schema, lReturnValue);

  return lReturnValue;
}

module.exports = {
  getAST,
};
