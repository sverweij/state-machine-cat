const fs = require("fs");
const allowedValues = require("../index-node").getAllowedValues();
const propertiesParser = require("./attributes-parser");

function getName(pValue) {
  return pValue.name;
}

const VALID_OUTPUT_TYPES = allowedValues.outputType.values.map(getName);
const VALID_INPUT_TYPES = allowedValues.inputType.values.map(getName);
const VALID_ENGINES = allowedValues.engine.values.map(getName);
const VALID_DIRECTIONS = allowedValues.direction.values.map(getName);

function isStdout(pFilename) {
  return "-" === pFilename;
}

function fileExists(pFilename) {
  try {
    if (!isStdout(pFilename)) {
      fs.accessSync(pFilename, fs.R_OK);
    }
    return true;
  } catch (pError) {
    return false;
  }
}

function validOption(pOption, pValidValues, pError) {
  if (pValidValues.includes(pOption)) {
    return pOption;
  }

  throw new Error(pError);
}

module.exports = {
  validOutputType: (pType) =>
    validOption(
      pType,
      VALID_OUTPUT_TYPES,
      `\n  error: '${pType}' is not a valid output type. smcat can emit:` +
        `\n          ${VALID_OUTPUT_TYPES.join(", ")}\n\n`
    ),

  validInputType: (pType) =>
    validOption(
      pType,
      VALID_INPUT_TYPES,
      `\n  error: '${pType}' is not a valid input type.` +
        `\n         smcat can read ${VALID_INPUT_TYPES.join(", ")}\n\n`
    ),

  validEngine: (pEngine) =>
    validOption(
      pEngine,
      VALID_ENGINES,
      `\n  error: '${pEngine}' is not a valid input type.` +
        `\n         you can choose from ${VALID_ENGINES.join(", ")}\n\n`
    ),

  validDirection: (pDirection) =>
    validOption(
      pDirection,
      VALID_DIRECTIONS,
      `\n  error: '${pDirection}' is not a valid direction.` +
        `\n         you can choose from ${VALID_DIRECTIONS.join(", ")}\n\n`
    ),

  validDotAttrs: (pDotAttributes) => {
    try {
      propertiesParser.parse(pDotAttributes);
      return pDotAttributes;
    } catch (pError) {
      throw new Error(`Invalid dot attributes: ${pError.message}`);
    }
  },

  validateArguments(pOptions) {
    if (!pOptions.inputFrom) {
      throw new Error(`\n  error: Please specify an input file.\n\n`);
    }

    if (!pOptions.outputTo) {
      throw new Error(`\n  error: Please specify an output file.\n\n`);
    }

    if (!fileExists(pOptions.inputFrom)) {
      throw new Error(
        `\n  error: Failed to open input file '${pOptions.inputFrom}'\n\n`
      );
    }

    return pOptions;
  },

  validOutputTypeRE: VALID_OUTPUT_TYPES.join("|"),

  defaultOutputType: allowedValues.outputType.default,

  validInputTypeRE: VALID_INPUT_TYPES.join("|"),

  defaultInputType: allowedValues.inputType.default,

  validEngineRE: VALID_ENGINES.join("|"),

  defaultEngine: allowedValues.engine.default,

  validDirectionRE: VALID_DIRECTIONS.join("|"),

  defaultDirection: allowedValues.direction.default,
};
