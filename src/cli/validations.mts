import { accessSync, constants } from "node:fs";
import type { IRenderOptions } from "types/state-machine-cat.mjs";
import { getAllowedValues } from "../index-node.mjs";
import { parse as parseAttributes } from "./attributes-parser.mjs";
import type { ICLIRenderOptions } from "./cli-types.mjs";

const allowedValues = getAllowedValues();

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
      accessSync(pFilename, constants.R_OK);
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

export const validOutputType = (pType: keyof IRenderOptions) =>
  validOption(
    pType,
    VALID_OUTPUT_TYPES,
    `\n  error: '${pType}' is not a valid output type. smcat can emit:` +
      `\n          ${VALID_OUTPUT_TYPES.join(", ")}\n\n`,
  );

export const validInputType = (pType: keyof IRenderOptions) =>
  validOption(
    pType,
    VALID_INPUT_TYPES,
    `\n  error: '${pType}' is not a valid input type.` +
      `\n         smcat can read ${VALID_INPUT_TYPES.join(", ")}\n\n`,
  );

export const validEngine = (pEngine: keyof IRenderOptions) =>
  validOption(
    pEngine,
    VALID_ENGINES,
    `\n  error: '${pEngine}' is not a valid input type.` +
      `\n         you can choose from ${VALID_ENGINES.join(", ")}\n\n`,
  );

export const validDirection = (pDirection: keyof IRenderOptions) =>
  validOption(
    pDirection,
    VALID_DIRECTIONS,
    `\n  error: '${pDirection}' is not a valid direction.` +
      `\n         you can choose from ${VALID_DIRECTIONS.join(", ")}\n\n`,
  );

// eslint-disable-next-line unicorn/prevent-abbreviations
export const validDotAttrs = (pDotAttributes: keyof IRenderOptions) => {
  try {
    parseAttributes(pDotAttributes);
    return pDotAttributes;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (pError: any) {
    throw new Error(`Invalid dot attributes: ${pError.message}`);
  }
};

export const validateArguments = (
  pOptions: ICLIRenderOptions,
): ICLIRenderOptions => {
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
};

export const validOutputTypeRE = VALID_OUTPUT_TYPES.join("|");

export const defaultOutputType = allowedValues.outputType.default;

export const validInputTypeRE = VALID_INPUT_TYPES.join("|");

export const defaultInputType = allowedValues.inputType.default;

export const validEngineRE = VALID_ENGINES.join("|");

export const defaultEngine = allowedValues.engine.default;

export const validDirectionRE = VALID_DIRECTIONS.join("|");

export const defaultDirection = allowedValues.direction.default;
