// @ts-check
/* eslint-disable security/detect-object-injection, no-inline-comments */
import path from "node:path";
import options from "../options.mjs";
import { parse as parseAttributes } from "./attributes-parser.mjs";

/**
 * @typedef {{[extension: string]: string}} DictionaryType
 */

const INPUT_EXTENSIONS = {
  ".smcat": "smcat",
  ".scxml": "scxml",
  ".xml": "scxml",
  ".json": "json",
  ".ast": "json",
};
const OUTPUT_EXTENSIONS = {
  ".ast": "json",
  ".dot": "dot",
  ".eps": "eps",
  ".json": "json",
  ".pdf": "pdf",
  ".png": "png",
  ".ps": "ps",
  ".ps2": "ps2",
  ".scjson": "scjson",
  ".scxml": "scxml",
  ".smcat": "smcat",
  ".svg": "svg",
};

/**
 * Given a filename in pString, returns what language is probably
 * contained in that file, judging from the extension (the last dot
 * in the string to end-of-string)
 *
 * When in doubt returns pDefault
 *
 * @param {string} pString - filename
 * @param {DictionaryType} pExtensionMap - a dictionary with
 *        extension : classification pairs
 * @param {string} pDefault - the default to return when the extension
 *        does not occur in the extension map
 * @return  {string} - language. Possible values: LHS of the passed
 *        extension map.
 */
function classifyExtension(pString, pExtensionMap, pDefault) {
  return pExtensionMap[path.extname(pString)] || pDefault;
}

/**
 * @param {import("../../types/state-machine-cat").OutputType} pOutputType
 * @returns {import("../../types/state-machine-cat").OutputType}
 */
function outputType2Extension(pOutputType) {
  const lExceptions = {
    oldeps: "eps",
    oldps: "ps",
    oldps2: "ps",
    oldsvg: "svg",
    ps2: "ps",
  };
  return lExceptions[pOutputType] || pOutputType;
}

/**
 * @param {string} pInputFrom
 * @param {import("../../types/state-machine-cat").OutputType} pOutputType
 * @returns {string}
 */
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

/**
 * @param {string|undefined} pOutputTo
 * @param {string} pInputFrom
 * @param {import("../../types/state-machine-cat").OutputType} pOutputType
 * @returns {string}
 */
function determineOutputTo(pOutputTo, pInputFrom, pOutputType) {
  return pOutputTo ? pOutputTo : deriveOutputFromInput(pInputFrom, pOutputType);
}

/**
 * @param {import("../../types/state-machine-cat").InputType|undefined} pInputType
 * @param {string} pInputFrom
 * @returns {import("../../types/state-machine-cat").InputType}
 */
function determineInputType(pInputType, pInputFrom) {
  if (pInputType) {
    return pInputType;
  }
  // @ts-expect-error we can safely cast this to InputType. classifyExtension
  // can probably use treatment with a generic, but with jsdoc annotations
  // if at all possible would likely be awkward.
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

/**
 * @param {Partial<import("./cli").ILooseCLIRenderOptions>} pOptions
 * @param {keyof import("./cli").ILooseCLIRenderOptions} pDotAttributes
 * @returns {import("../../types/state-machine-cat").dotAttributesType}
 */
function determineDotAttributes(pOptions, pDotAttributes) {
  return Boolean(pOptions?.[pDotAttributes]) &&
    typeof pOptions[pDotAttributes] === "string"
    ? // @ts-expect-error parseAttributes expects a string - which we can guarantee (see above) - but tsc can't/ doesn't see it
      parseAttributes(pOptions[pDotAttributes])
    : [];
}

/**
 * transforms the given argument and options to a uniform format
 *
 * - guesses the input type when not given
 * - guesses the output type when not given
 * - guesses the filename to output to when not given
 * - translates parserOutput to a regular output type
 *
 * @param  {string} pArgument an argument (containing the filename to parse)
 * @param  {import("./cli").ILooseCLIRenderOptions} pLooseOptions
 * @return {import("./cli").ICLIRenderOptions}
 *          the passed options object, but normalized
 */
export default function normalize(pArgument = "-", pLooseOptions = {}) {
  const lNormalizedInputFrom = pArgument || "-";
  const lNormalizedInputType = determineInputType(
    pLooseOptions.inputType,
    lNormalizedInputFrom
  );
  const lNormalizedOutputType = determineOutputType(
    pLooseOptions.outputType,
    pLooseOptions.outputTo
  );

  return {
    inputFrom: lNormalizedInputFrom,
    inputType: lNormalizedInputType,
    outputType: lNormalizedOutputType,
    outputTo: determineOutputTo(
      pLooseOptions.outputTo,
      lNormalizedInputFrom,
      lNormalizedOutputType
    ),
    engine: determineParameter(pLooseOptions, "engine"),
    direction: determineParameter(pLooseOptions, "direction"),
    dotGraphAttrs: determineDotAttributes(pLooseOptions, "dotGraphAttrs"),
    dotNodeAttrs: determineDotAttributes(pLooseOptions, "dotNodeAttrs"),
    dotEdgeAttrs: determineDotAttributes(pLooseOptions, "dotEdgeAttrs"),
    desugar: pLooseOptions?.desugar ?? false,
  };
}
