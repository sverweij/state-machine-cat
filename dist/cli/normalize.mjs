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
function classifyExtension(pString, pExtensionMap, pDefault) {
	return pExtensionMap[path.extname(pString)] || pDefault;
}
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
function deriveOutputFromInput(pInputFrom, pOutputType) {
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
function determineOutputTo(pOutputTo, pInputFrom, pOutputType) {
	return pOutputTo ? pOutputTo : deriveOutputFromInput(pInputFrom, pOutputType);
}
function determineInputType(pInputFrom, pInputType) {
	if (pInputType) {
		return pInputType;
	}
	return classifyExtension(
		pInputFrom,
		INPUT_EXTENSIONS,
		options.getAllowedValues().inputType.default,
	);
}
function determineOutputType(pOutputTo, pOutputType) {
	if (pOutputType) {
		return pOutputType;
	}
	if (pOutputTo) {
		return classifyExtension(
			pOutputTo,
			OUTPUT_EXTENSIONS,
			options.getAllowedValues().outputType.default,
		);
	}
	return options.getAllowedValues().outputType.default;
}
function determineParameter(pOptions, pParameter) {
	return Object.hasOwn(pOptions, pParameter)
		? pOptions[pParameter]
		: options.getAllowedValues()[pParameter].default;
}
function determineDotAttributes(pOptions, pDotAttributes) {
	return pOptions?.[pDotAttributes] &&
		typeof pOptions[pDotAttributes] === "string"
		? parseAttributes(pOptions[pDotAttributes])
		: [];
}
export default function normalize(pArgument = "-", pLooseOptions = {}) {
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
		engine: determineParameter(pLooseOptions, "engine"),
		direction: determineParameter(pLooseOptions, "direction"),
		dotGraphAttrs: determineDotAttributes(pLooseOptions, "dotGraphAttrs"),
		dotNodeAttrs: determineDotAttributes(pLooseOptions, "dotNodeAttrs"),
		dotEdgeAttrs: determineDotAttributes(pLooseOptions, "dotEdgeAttrs"),
		desugar: pLooseOptions?.desugar ?? false,
	};
}
