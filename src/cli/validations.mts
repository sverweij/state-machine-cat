import fs from "node:fs";
import type { IRenderOptions } from "types/state-machine-cat.js";
import smcat from "../index-node.mjs";
import { parse as parseAttributes } from "./attributes-parser.mjs";
import type { ICLIRenderOptions } from "./cli.js";

const allowedValues = smcat.getAllowedValues();

function getName(pValue: { name: string }): string {
  return pValue.name;
}

const VALID_OUTPUT_TYPES = allowedValues.outputType.values.map(getName);
const VALID_INPUT_TYPES = allowedValues.inputType.values.map(getName);
const VALID_ENGINES = allowedValues.engine.values.map(getName);
const VALID_DIRECTIONS = allowedValues.direction.values.map(getName);

function isStdout(pFilename: string): boolean {
  return "-" === pFilename;
}

function fileExists(pFilename: string): boolean {
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
function validOption(
  pOption: keyof IRenderOptions,
  pValidValues: string[],
  pError: string,
): never | keyof IRenderOptions {
  if (pValidValues.includes(pOption)) {
    return pOption;
  }

  throw new Error(pError);
}

export default {
  validOutputType: (pType: keyof IRenderOptions) =>
    validOption(
      pType,
      VALID_OUTPUT_TYPES,
      `\n  error: '${pType}' is not a valid output type. smcat can emit:` +
        `\n          ${VALID_OUTPUT_TYPES.join(", ")}\n\n`,
    ),

  validInputType: (pType: keyof IRenderOptions) =>
    validOption(
      pType,
      VALID_INPUT_TYPES,
      `\n  error: '${pType}' is not a valid input type.` +
        `\n         smcat can read ${VALID_INPUT_TYPES.join(", ")}\n\n`,
    ),

  validEngine: (pEngine: keyof IRenderOptions) =>
    validOption(
      pEngine,
      VALID_ENGINES,
      `\n  error: '${pEngine}' is not a valid input type.` +
        `\n         you can choose from ${VALID_ENGINES.join(", ")}\n\n`,
    ),

  validDirection: (pDirection: keyof IRenderOptions) =>
    validOption(
      pDirection,
      VALID_DIRECTIONS,
      `\n  error: '${pDirection}' is not a valid direction.` +
        `\n         you can choose from ${VALID_DIRECTIONS.join(", ")}\n\n`,
    ),

  validDotAttrs: (pDotAttributes: keyof IRenderOptions) => {
    try {
      parseAttributes(pDotAttributes);
      return pDotAttributes;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (pError: any) {
      throw new Error(`Invalid dot attributes: ${pError.message}`);
    }
  },

  validateArguments(pOptions: ICLIRenderOptions): ICLIRenderOptions {
    if (!pOptions.inputFrom) {
      throw new Error(`\n  error: Please specify an input file.\n\n`);
    }

    if (!pOptions.outputTo) {
      throw new Error(`\n  error: Please specify an output file.\n\n`);
    }

    if (!fileExists(pOptions.inputFrom)) {
      throw new Error(
        `\n  error: Failed to open input file '${pOptions.inputFrom}'\n\n`,
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
