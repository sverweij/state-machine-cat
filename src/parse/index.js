const Ajv     = require('ajv');
const options = require('../options');
const parser  = require('./smcat-parser');
const $schema = require('./smcat-ast.schema.json');

const ajv     = new Ajv();

function validateAgainstSchema(pSchema, pObject) {
    if (!ajv.validate(pSchema, pObject)) {
        throw new Error(
            `The provided JSON is not a valid state-machine-cat AST: ${ajv.errorsText()}.\n`
        );
    }
}

function getAST(pScript, pOptions){
    let lRetval = pScript;

    if (options.getOptionValue(pOptions, "inputType") === "smcat") {
        lRetval = parser.parse(pScript);
    } else if (typeof pScript === "string") { // json
        lRetval = JSON.parse(pScript);
    }

    validateAgainstSchema($schema, lRetval);

    return lRetval;
}

module.exports = {
    getAST
};
