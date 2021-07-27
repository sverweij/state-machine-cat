/* eslint-disable security/detect-object-injection */
import path from "node:path";
import options from "../options.mjs";
import { parse as parseAttributes } from "./attributes-parser.mjs";

const INPUT_EXTENSIONS = {
  ".smcat": "smcat",
  ".scxml": "scxml",
  ".xml": "scxml",
  ".json": "json",
  ".ast": "json",
};
const OUTPUT_EXTENSIONS = {
  ".smcat": "smcat",
  ".dot": "dot",
  ".json": "json",
  ".ast": "json",
  ".scjson": "scjson",
  ".scxml": "scxml",
  ".svg": "svg",
  ".ps": "ps",
  ".ps2": "ps2",
  ".eps": "eps",
};

/**
 * Given a filename in pString, returns what language is probably
 * contained in that file, judging from the extension (the last dot
 * in the string to end-of-string)
 *
 * When in doubt returns pDefault
 *
 * @param {string} pString - filename
 * @param {object} pExtensionMap - a dictionary with
 *        extension : classification pairs
 * @param {string} pDefault - the default to return when the extension
 *        does not occur in the extension map
 * @return  {string} - language. Possible values: LHS of the passed
 *        extension map.
 */
function classifyExtension(pString, pExtensionMap, pDefault) {
  return pExtensionMap[path.extname(pString)] || pDefault;
}

function outputType2Extension(pOutputType) {
  const lExceptions = {
    oldsvg: "svg",
    oldps2: "ps",
    oldeps: "eps",
    ps2: "ps",
  };
  return lExceptions[pOutputType] || pOutputType;
}
function deriveOutputFromInput(pInputFrom, pOutputType) {
  const lExtension = outputType2Extension(pOutputType);

  if (!pInputFrom || "-" === pInputFrom) {
    return "-";
  }
  return path
    .join(
      path.dirname(pInputFrom),
      path.basename(pInputFrom, path.extname(pInputFrom))
    )
    .concat(".")
    .concat(lExtension);
}

function determineOutputTo(pOutputTo, pInputFrom, pOutputType) {
  return Boolean(pOutputTo)
    ? pOutputTo
    : deriveOutputFromInput(pInputFrom, pOutputType);
}

function determineInputType(pInputType, pInputFrom) {
  if (pInputType) {
    return pInputType;
  }
  return classifyExtension(
    pInputFrom,
    INPUT_EXTENSIONS,
    options.getAllowedValues().inputType.default
  );
}

function determineOutputType(pOutputType, pOutputTo) {
  if (Boolean(pOutputType)) {
    return pOutputType;
  }
  if (Boolean(pOutputTo)) {
    return classifyExtension(
      pOutputTo,
      OUTPUT_EXTENSIONS,
      options.getAllowedValues().outputType.default
    );
  }
  return options.getAllowedValues().outputType.default;
}

function determineParameter(pOptions, pParameter) {
  return Object.prototype.hasOwnProperty.call(pOptions, pParameter)
    ? pOptions[pParameter]
    : options.getAllowedValues()[pParameter].default;
}

function determineDotAttributes(pOptions, pDotAttributes) {
  return Object.prototype.hasOwnProperty.call(pOptions, pDotAttributes)
    ? parseAttributes(pOptions[pDotAttributes])
    : [];
}

/**
 * transforms the given argument and options to a uniform format
 *
 * - guesses the input type when not given
 * - guesses the output type when not given
 * - gueses the filename to output to when not given
 * - translates parserOutput to a regular output type
 *
 * @param  {string} pArgument an argument (containing the filename to parse)
 * @param  {object} pOptions a commander options object
 * @return {object} a commander options object with options 'normalized'
 */
export default function normalize(pArgument = "-", pOptions = {}) {
  const lReturnValue = { ...pOptions };

  lReturnValue.inputFrom = pArgument || "-";
  lReturnValue.inputType = determineInputType(
    pOptions.inputType,
    lReturnValue.inputFrom
  );
  lReturnValue.outputType = determineOutputType(
    pOptions.outputType,
    pOptions.outputTo
  );
  lReturnValue.outputTo = determineOutputTo(
    pOptions.outputTo,
    lReturnValue.inputFrom,
    lReturnValue.outputType
  );
  lReturnValue.engine = determineParameter(pOptions, "engine");
  lReturnValue.direction = determineParameter(pOptions, "direction");
  lReturnValue.dotGraphAttrs = determineDotAttributes(
    pOptions,
    "dotGraphAttrs"
  );
  lReturnValue.dotNodeAttrs = determineDotAttributes(pOptions, "dotNodeAttrs");
  lReturnValue.dotEdgeAttrs = determineDotAttributes(pOptions, "dotEdgeAttrs");

  return lReturnValue;
}
