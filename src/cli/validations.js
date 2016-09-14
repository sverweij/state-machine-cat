"use strict";

module.exports = (() => {
    const fs       = require("fs");
    const stategen = require("../..");

    const VALID_OUTPUT_TYPES =
        stategen.getAllowedValues().outputType.map(pValue => pValue.name);
    const VALID_INPUT_TYPES =
        stategen.getAllowedValues().inputType.map(pValue => pValue.name);

    function isStdout(pFilename) {
        return "-" === pFilename;
    }

    function fileExists(pFilename) {
        try {
            if (!isStdout(pFilename)) {
                fs.accessSync(pFilename, fs.R_OK);
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    return {
        validOutputType(pType) {
            if (VALID_OUTPUT_TYPES.some(pName => pName === pType)){
                return pType;
            }

            throw Error(
                `\n  error: '${pType}' is not a valid output type. smcat can emit:` +
                `\n          ${VALID_OUTPUT_TYPES.join(", ")}\n\n`
            );
        },

        validInputType(pType) {
            if (VALID_INPUT_TYPES.some(pName => pName === pType)){
                return pType;
            }

            throw Error(
                `\n  error: '${pType}' is not a valid input type.` +
                `\n         smcat can read ${VALID_INPUT_TYPES.join(", ")}\n\n`);
        },

        validateArguments(pOptions) {
            return new Promise((pResolve, pReject) => {
                if (!pOptions.inputFrom) {
                    pReject(Error(`\n  error: Please specify an input file.\n\n`));
                }

                if (!pOptions.outputTo) {
                    pReject(Error(`\n  error: Please specify an output file.\n\n`));
                }

                if (!fileExists(pOptions.inputFrom)) {
                    pReject(Error(`\n  error: Failed to open input file '${pOptions.inputFrom}'\n\n`));
                }

                pResolve(pOptions);
            });
        },

        validOutputTypeRE: VALID_OUTPUT_TYPES.join("|"),

        validInputTypeRE: VALID_INPUT_TYPES.join("|")

    };
})();

/*
    This file is part of smcat.

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
