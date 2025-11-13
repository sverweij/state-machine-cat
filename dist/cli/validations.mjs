import { accessSync, constants } from "node:fs";
import { getAllowedValues } from "../index-node.mjs";
import { parse as parseAttributes } from "./attributes-parser.mjs";
const allowedValues = getAllowedValues();
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
			accessSync(pFilename, constants.R_OK);
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
export const validOutputType = (pType) =>
	validOption(
		pType,
		VALID_OUTPUT_TYPES,
		`\n  error: '${pType}' is not a valid output type. smcat can emit:` +
			`\n          ${VALID_OUTPUT_TYPES.join(", ")}\n\n`,
	);
export const validInputType = (pType) =>
	validOption(
		pType,
		VALID_INPUT_TYPES,
		`\n  error: '${pType}' is not a valid input type.` +
			`\n         smcat can read ${VALID_INPUT_TYPES.join(", ")}\n\n`,
	);
export const validEngine = (pEngine) =>
	validOption(
		pEngine,
		VALID_ENGINES,
		`\n  error: '${pEngine}' is not a valid input type.` +
			`\n         you can choose from ${VALID_ENGINES.join(", ")}\n\n`,
	);
export const validDirection = (pDirection) =>
	validOption(
		pDirection,
		VALID_DIRECTIONS,
		`\n  error: '${pDirection}' is not a valid direction.` +
			`\n         you can choose from ${VALID_DIRECTIONS.join(", ")}\n\n`,
	);
export const validDotAttrs = (pDotAttributes) => {
	try {
		parseAttributes(pDotAttributes);
		return pDotAttributes;
	} catch (pError) {
		throw new Error(`Invalid dot attributes: ${pError.message}`);
	}
};
export const validateArguments = (pOptions) => {
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
