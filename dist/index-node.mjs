import {
	getAllowedValues as _getAllowedValues,
	getOptionValue,
} from "./options.mjs";
import { getAST } from "./parse/index.mjs";
import desugar from "./transform/desugar.mjs";
import getRenderFunction from "./render/index-node.mjs";
import { version as _version } from "./version.mjs";
export async function render(pScript, pOptions) {
	const lStateMachine = await getAST(pScript, pOptions);
	const lDesugar = getOptionValue(pOptions, "desugar");
	const lRenderFunction = await getRenderFunction(
		getOptionValue(pOptions, "outputType"),
	);
	return lRenderFunction(
		lDesugar ? desugar(lStateMachine) : lStateMachine,
		pOptions,
	);
}
export const version = _version;
export function getAllowedValues() {
	return _getAllowedValues();
}
