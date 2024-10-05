/* eslint-disable security/detect-object-injection */
import path from "node:path";
import type {
  DirectionType,
  dotAttributesType,
  EngineType,
  InputType,
  OutputType,
} from "types/state-machine-cat.mjs";
import options from "../options.mjs";
import { parse as parseAttributes } from "./attributes-parser.mjs";
import type {
  ICLIRenderOptions,
  ILooseCLIRenderOptions,
} from "./cli-types.mjs";

type DictionaryType = { [extension: string]: string };

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
 */
function classifyExtension(
  pString: string,
  pExtensionMap: DictionaryType,
  pDefault: string,
): string {
  return pExtensionMap[path.extname(pString)] || pDefault;
}

/**
 * @param {import("../..").OutputType} pOutputType
 * @returns {import("../..").OutputType}
 */
function outputType2Extension(pOutputType: OutputType): OutputType {
  const lExceptions: { [outputType: string]: OutputType } = {
    oldeps: "eps",
    oldps: "ps",
    oldps2: "ps",
    oldsvg: "svg",
    ps2: "ps",
  };
  return lExceptions[pOutputType] || pOutputType;
}

function deriveOutputFromInput(
  pInputFrom: string,
  pOutputType: OutputType,
): string {
  const lExtension = outputType2Extension(pOutputType);

  if (!pInputFrom || "-" === pInputFrom) {
    return "-";
  }
  return path
    .join(
      path.dirname(pInputFrom),
      path.basename(pInputFrom, path.extname(pInputFrom)),
    )
    .concat(".")
    .concat(lExtension);
}

function determineOutputTo(
  pOutputTo: string | undefined,
  pInputFrom: string,
  pOutputType: OutputType,
): string {
  return pOutputTo ? pOutputTo : deriveOutputFromInput(pInputFrom, pOutputType);
}

function determineInputType(
  pInputFrom: string,
  pInputType?: InputType,
): InputType {
  if (pInputType) {
    return pInputType;
  }
  // @ts-expect-error we can safely cast this to InputType. classifyExtension
  // can probably use treatment with a generic, but with jsdoc annotations
  // if at all possible would likely be awkward.
  return classifyExtension(
    pInputFrom,
    INPUT_EXTENSIONS,
    options.getAllowedValues().inputType.default,
  );
}

function determineOutputType(
  pOutputTo?: string,
  pOutputType?: OutputType,
): OutputType {
  if (pOutputType) {
    return pOutputType;
  }
  if (pOutputTo) {
    // @ts-expect-error we can safely cast this to OutputType. classifyExtension
    // can probably use treatment with a generic, but with jsdoc annotations
    // if at all possible would likely be awkward.
    return classifyExtension(
      pOutputTo,
      OUTPUT_EXTENSIONS,
      options.getAllowedValues().outputType.default,
    );
  }
  // @ts-expect-error cast to OutputType is safe - see above
  return options.getAllowedValues().outputType.default;
}

function determineParameter(
  pOptions: ILooseCLIRenderOptions,
  pParameter: string,
): string {
  return Object.hasOwn(pOptions, pParameter)
    ? // @ts-expect-error tsc complains we can't index pOptions with a thing of type string - however: we can
      pOptions[pParameter]
    : // @ts-expect-error tsc complains we can't index pOptions with a thing of type string - however: we can
      options.getAllowedValues()[pParameter].default;
}

function determineDotAttributes(
  pOptions: ILooseCLIRenderOptions,
  pDotAttributes: keyof ILooseCLIRenderOptions,
): dotAttributesType {
  return Boolean(pOptions?.[pDotAttributes]) &&
    typeof pOptions[pDotAttributes] === "string"
    ? (parseAttributes(pOptions[pDotAttributes]) as dotAttributesType)
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
 * @param  pArgument an argument (containing the filename to parse)
 * @param  pLooseOptions
 * @return the passed options object, but normalized
 */
export default function normalize(
  pArgument = "-",
  pLooseOptions: ILooseCLIRenderOptions = {},
): ICLIRenderOptions {
  const lNormalizedInputFrom = pArgument || "-";
  const lNormalizedInputType = determineInputType(
    lNormalizedInputFrom,
    pLooseOptions.inputType,
  );
  const lNormalizedOutputType = determineOutputType(
    pLooseOptions.outputTo,
    pLooseOptions.outputType,
  );

  return {
    inputFrom: lNormalizedInputFrom,
    inputType: lNormalizedInputType,
    outputType: lNormalizedOutputType,
    outputTo: determineOutputTo(
      pLooseOptions.outputTo,
      lNormalizedInputFrom,
      lNormalizedOutputType,
    ),
    engine: determineParameter(pLooseOptions, "engine") as EngineType,
    direction: determineParameter(pLooseOptions, "direction") as DirectionType,
    dotGraphAttrs: determineDotAttributes(pLooseOptions, "dotGraphAttrs"),
    dotNodeAttrs: determineDotAttributes(pLooseOptions, "dotNodeAttrs"),
    dotEdgeAttrs: determineDotAttributes(pLooseOptions, "dotEdgeAttrs"),
    desugar: pLooseOptions?.desugar ?? false,
  };
}
