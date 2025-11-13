import { parseArgs } from "node:util";
import { version } from "../version.mjs";
import { formatError, displayLicense, transform } from "./actions.mjs";
import normalize from "./normalize.mjs";
import {
	validOutputType,
	validInputType,
	validEngine,
	validDirection,
	validDotAttrs,
	validateArguments,
	defaultOutputType,
	defaultInputType,
	defaultEngine,
	defaultDirection,
} from "./validations.mjs";
const HELP_TEXT = `Usage: smcat [options] [infile]

Write beautiful state charts - https://github.com/sverweij/state-machine-cat

Options:
  -T, --output-type <type>  ast|dot|eps|json|oldeps|oldps|oldps2|oldsvg|pdf|
                            png|ps|ps2|scjson|scxml|smcat|svg
                            (default: "svg")
  -I, --input-type <type>   smcat|json|scxml (default: "smcat")
  -E, --engine <type>       dot|circo|fdp|neato|osage|twopi (default: "dot")
  -d, --direction <dir>     top-down|bottom-top|left-right|right-left (default:
                            "top-down")
  -o --output-to <file>     File to write to. use - for stdout.
  --desugar                 transform pseudo states into transitions
                            (!experimental!)
  -V, --version             output the version number
  -l, --license             Display license and exit
  -h, --help                display help for command
`;
function presentError(pError, pErrorStream) {
	pErrorStream.write(formatError(pError));
	process.exitCode = 1;
}
function kebabToCamel(pString) {
	return pString
		.split("-")
		.map((pWord, pIndex) =>
			pIndex === 0
				? pWord
				: pWord.charAt(0).toUpperCase() + pWord.slice(1).toLowerCase(),
		)
		.join("");
}
function camelizeObject(pObject) {
	const lNewObject = {};
	for (const lKey in pObject) {
		if (Object.hasOwn(pObject, lKey)) {
			const camelCaseKey = kebabToCamel(lKey);
			lNewObject[camelCaseKey] = pObject[lKey];
		}
	}
	return lNewObject;
}
function parseArguments(pArguments) {
	const lOptions = {
		"output-type": {
			type: "string",
			short: "T",
			default: defaultOutputType,
		},
		"input-type": {
			type: "string",
			short: "I",
			default: defaultInputType,
		},
		engine: {
			type: "string",
			short: "E",
			default: defaultEngine,
		},
		direction: {
			type: "string",
			short: "d",
			default: defaultDirection,
		},
		"output-to": {
			type: "string",
			short: "o",
		},
		"dot-graph-attrs": {
			type: "string",
		},
		"dot-node-attrs": {
			type: "string",
		},
		"dot-edge-attrs": {
			type: "string",
		},
		desugar: {
			type: "boolean",
			default: false,
		},
		license: {
			type: "boolean",
			short: "l",
			default: false,
		},
		help: {
			type: "boolean",
			short: "h",
			default: false,
		},
		version: {
			type: "boolean",
			short: "V",
			default: false,
		},
	};
	const { values, positionals } = parseArgs({
		args: pArguments,
		options: lOptions,
		strict: true,
		allowPositionals: true,
		tokens: false,
	});
	values["output-type"] = validOutputType(values["output-type"]);
	values["input-type"] = validInputType(values["input-type"]);
	values.engine = validEngine(values.engine);
	values.direction = validDirection(values.direction);
	if (values["dot-graph-attrs"])
		values["dot-graph-attrs"] = validDotAttrs(values["dot-graph-attrs"]);
	if (values["dot-node-attrs"])
		values["dot-node-attrs"] = validDotAttrs(values["dot-node-attrs"]);
	if (values["dot-edge-attrs"])
		values["dot-edge-attrs"] = validDotAttrs(values["dot-edge-attrs"]);
	return { values: camelizeObject(values), positionals };
}
export default async function cli(pArguments = process.argv, pOptions) {
	const lOptions = {
		outStream: process.stdout,
		errorStream: process.stderr,
		...pOptions,
	};
	try {
		const { values, positionals } = parseArguments(pArguments.slice(2));
		if (values.help) {
			lOptions.outStream.write(HELP_TEXT, "utf8");
			return;
		}
		if (values.version) {
			lOptions.outStream.write(`${version}\n`, "utf8");
			return;
		}
		if (values.license) {
			displayLicense(lOptions.outStream);
			return;
		}
		await transform(validateArguments(normalize(positionals[0], values)));
	} catch (pError) {
		presentError(pError, lOptions.errorStream);
	}
}
