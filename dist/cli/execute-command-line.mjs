import { readFileSync } from "node:fs";
import { Command, Option } from "commander";
import satisfies from "semver/functions/satisfies.js";
import { formatError, displayLicense, transform } from "./actions.mjs";
import normalize from "./normalize.mjs";
import validations from "./validations.mjs";
const $package = JSON.parse(
	readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
);
function presentError(pError, pErrorStream) {
	pErrorStream.write(formatError(pError));
	process.exitCode = 1;
}
function parseArguments(pArguments) {
	return new Command()
		.description(
			"Write beautiful state charts - https://github.com/sverweij/state-machine-cat",
		)
		.option(
			"-T, --output-type <type>",
			validations.validOutputTypeRE,
			validations.validOutputType,
			validations.defaultOutputType,
		)
		.option(
			"-I, --input-type <type>",
			validations.validInputTypeRE,
			validations.validInputType,
			validations.defaultInputType,
		)
		.option(
			"-E, --engine <type>",
			validations.validEngineRE,
			validations.validEngine,
			validations.defaultEngine,
		)
		.option(
			"-d, --direction <dir>",
			validations.validDirectionRE,
			validations.validDirection,
			validations.defaultDirection,
		)
		.option("-o --output-to <file>", "File to write to. use - for stdout.")
		.addOption(
			new Option(
				"--dot-graph-attrs <string>",
				"graph attributes to pass to the dot render engine",
			)
				.argParser(validations.validDotAttrs)
				.hideHelp(true),
		)
		.addOption(
			new Option(
				"--dot-node-attrs <string>",
				"node attributes to pass to the dot render engine",
			)
				.argParser(validations.validDotAttrs)
				.hideHelp(true),
		)
		.addOption(
			new Option(
				"--dot-edge-attrs <string>",
				"edge attributes to pass to the dot render engine",
			)
				.argParser(validations.validDotAttrs)
				.hideHelp(true),
		)
		.option(
			"--desugar",
			"transform pseudo states into transitions (!experimental!)",
		)
		.version($package.version)
		.option("-l, --license", "Display license and exit")
		.arguments("[infile]")
		.parse(pArguments);
}
function assertNodeVersion(pCurrentNodeVersion, pSupportedEngines) {
	if (!satisfies(pCurrentNodeVersion, pSupportedEngines)) {
		throw new Error(
			`\nERROR: your node version (${pCurrentNodeVersion}) is not recent enough.\n` +
				`       state-machine-cat is supported on node ${pSupportedEngines}\n\n`,
		);
	}
}
export default async function executeCommandLine(
	pArguments = process.argv,
	pOptions,
) {
	const lOptions = {
		currentNodeVersion: process.versions.node,
		supportedEngines: $package.engines.node,
		outStream: process.stdout,
		errorStream: process.stderr,
		...pOptions,
	};
	try {
		assertNodeVersion(lOptions.currentNodeVersion, lOptions.supportedEngines);
		const lProgram = parseArguments(pArguments);
		if (lProgram.opts()?.license) {
			displayLicense(lOptions.outStream);
			return;
		}
		await transform(
			validations.validateArguments(
				normalize(lProgram.args[0], lProgram.opts()),
			),
		);
	} catch (pError) {
		presentError(pError, lOptions.errorStream);
	}
}
