import options from "./options.mjs";
import parse from "./parse/index.mjs";
import desugar from "./transform/desugar.mjs";
import getRenderFunction from "./render/index.mjs";
import { version as _version } from "./version.mjs";
export function render(pScript, pOptions) {
	const lOptions = pOptions ?? {};
	const lStateMachine = parse.getAST(pScript, lOptions);
	const lDesugar = options.getOptionValue(lOptions, "desugar");
	return getRenderFunction(options.getOptionValue(lOptions, "outputType"))(
		lDesugar ? desugar(lStateMachine) : lStateMachine,
		lOptions,
	);
}
export const version = _version;
export function getAllowedValues() {
	return options.getAllowedValues();
}
export default {
	render,
	version,
	getAllowedValues,
};
