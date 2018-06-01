const fs    = require("fs");
const smcat = require("../..");

const VALID_OUTPUT_TYPES =
    smcat.getAllowedValues().outputType.values.map((pValue) => pValue.name);
const VALID_INPUT_TYPES =
    smcat.getAllowedValues().inputType.values.map((pValue) => pValue.name);
const VALID_ENGINES =
    smcat.getAllowedValues().engine.values.map((pValue) => pValue.name);
const VALID_DIRECTIONS =
    smcat.getAllowedValues().direction.values.map((pValue) => pValue.name);

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

module.exports = {
    validOutputType(pType) {
        if (VALID_OUTPUT_TYPES.some((pName) => pName === pType)){
            return pType;
        }

        throw Error(
            `\n  error: '${pType}' is not a valid output type. smcat can emit:` +
            `\n          ${VALID_OUTPUT_TYPES.join(", ")}\n\n`
        );
    },

    validInputType(pType) {
        if (VALID_INPUT_TYPES.some((pName) => pName === pType)){
            return pType;
        }

        throw Error(
            `\n  error: '${pType}' is not a valid input type.` +
            `\n         smcat can read ${VALID_INPUT_TYPES.join(", ")}\n\n`);
    },

    validEngine(pEngine) {
        if (VALID_ENGINES.some((pName) => pName === pEngine)){
            return pEngine;
        }

        throw Error(
            `\n  error: '${pEngine}' is not a valid input type.` +
            `\n         you can choose from ${VALID_ENGINES.join(", ")}\n\n`);

    },

    validDirection(pDirection) {
        if (VALID_DIRECTIONS.some((pName) => pName === pDirection)){
            return pDirection;
        }

        throw Error(
            `\n  error: '${pDirection}' is not a valid direction.` +
            `\n         you can choose from ${VALID_DIRECTIONS.join(", ")}\n\n`);

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

    defaultOutputType: smcat.getAllowedValues().outputType.default,

    validInputTypeRE: VALID_INPUT_TYPES.join("|"),

    defaultInputType: smcat.getAllowedValues().inputType.default,

    validEngineRE: VALID_ENGINES.join("|"),

    defaultEngine: smcat.getAllowedValues().engine.default,

    validDirectionRE: VALID_DIRECTIONS.join("|"),

    defaultDirection: smcat.getAllowedValues().direction.default

};
