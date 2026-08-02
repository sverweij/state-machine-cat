import { spawnSync } from "node:child_process";
const DEFAULT_OPTIONS = {
	exec: "dot",
	format: "svg",
	engine: "dot",
};
const BINARY_FORMATS = new Set(["png", "pdf"]);
export function convert(pDot, pOptions) {
	const lOptions = {
		...DEFAULT_OPTIONS,
		...pOptions,
	};
	const { stdout, status, error } = spawnSync(
		lOptions.exec,
		[`-K${lOptions.engine}`, `-T${lOptions.format}`],
		{
			input: pDot,
		},
	);
	if (status === 0) {
		return stdout.toString(
			BINARY_FORMATS.has(lOptions.format) ? "binary" : "utf8",
		);
	} else if (error) {
		throw new Error(error);
	} else {
		throw new Error(`Unexpected error occurred. Exit code ${status}`);
	}
}
export function isAvailable(pOptions) {
	const lOptions = {
		...DEFAULT_OPTIONS,
		...pOptions,
	};
	const { status, stderr } = spawnSync(lOptions.exec, ["-V"]);
	return (
		status === 0 && stderr.toString("utf8").startsWith("dot - graphviz version")
	);
}
