// @ts-check
import fs from "node:fs";
import smcat from "../index-node.mjs";
import { parse as parseAttributes } from "./attributes-parser.mjs";

const allowedValues = smcat.getAllowedValues();

/**
 * @param {{name: string}} pValue
 * @returns {string}
 */
function getName(pValue) {
  return pValue.name;
}

const VALID_OUTPUT_TYPES = allowedValues.outputType.values.map(getName);
const VALID_INPUT_TYPES = allowedValues.inputType.values.map(getName);
const VALID_ENGINES = allowedValues.engine.values.map(getName);
const VALID_DIRECTIONS = allowedValues.direction.values.map(getName);

/**
 * @param {string} pFilename
 * @returns {boolean}
 */
function isStdout(pFilename) {
  return "-" === pFilename;
}

/**
 * @param {string} pFilename
 * @returns {boolean}
 */
function fileExists(pFilename) {
  try {
    if (!isStdout(pFilename)) {
      fs.accessSync(pFilename, fs.constants.R_OK);
    }
    return true;
  } catch (pError) {
    return false;
  }
}

/**
 * This function is shaped so it can serve as a validation function in a
 * commander option.
 *
 * @param {keyof import("../../types/state-machine-cat").IRenderOptions} pOption
 * @param {string[]} pValidValues
 * @param {string} pError
 * @returns {never|keyof import("../../types/state-machine-cat").IRenderOptions}
 */
function validOption(pOption, pValidValues, pError) {
  if (pValidValues.includes(pOption)) {
    return pOption;
  }

  throw new Error(pError);
}

export default {
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
      parseAttributes(pDotAttributes);
      return pDotAttributes;
    } catch (pError) {
      throw new Error(`Invalid dot attributes: ${pError.message}`);
    }
  },

  /**
   * @param {import("./cli").ICLIRenderOptions} pOptions
   * @returns {never|import("./cli").ICLIRenderOptions}
   */
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
