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
    } else if (typeof pScript === "string") { // json or a javascript object
        lRetval = JSON.parse(pScript);
    }

    validateAgainstSchema($schema, lRetval);

    return lRetval;
}

module.exports = {
    getAST
};

/*
 This file is part of state-machine-cat.

 smcat is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 smcat is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with smcat.  If not, see <http://www.gnu.org/licenses/>.
 */
