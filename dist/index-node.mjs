import options from "./options.mjs";
import parse from "./parse/index.mjs";
import desugar from "./transform/desugar.mjs";
import getRenderFunction from "./render/index-node.mjs";
import { version as _version } from "./version.mjs";
export async function render(pScript, pOptions) {
	const lStateMachine = await parse.getAST(pScript, pOptions);
	const lDesugar = options.getOptionValue(pOptions, "desugar");
	const lRenderFunction = await getRenderFunction(
		options.getOptionValue(pOptions, "outputType"),
	);
	return lRenderFunction(
		lDesugar ? desugar(lStateMachine) : lStateMachine,
		pOptions,
	);
}
export const version = _version;
export function getAllowedValues() {
	return options.getAllowedValues();
}
