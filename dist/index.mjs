import {
	getAllowedValues as _getAllowedValues,
	getOptionValue,
} from "./options.mjs";
import { getAST } from "./parse/index.mjs";
import getRenderFunction from "./render/index.mjs";
import { version as _version } from "./version.mjs";
let gDesugarModule = null;
async function desugar(pStateMachine) {
	if (!gDesugarModule) {
		gDesugarModule = await import("./transform/desugar.mjs");
	}
	const lDesugarFunction = gDesugarModule.default;
	return lDesugarFunction(pStateMachine);
}
export async function render(pScript, pOptions) {
	const lOptions = pOptions ?? {};
	const lStateMachine = await getAST(pScript, lOptions);
	const lDesugar = getOptionValue(lOptions, "desugar");
	const lRenderFunction = await getRenderFunction(
		getOptionValue(lOptions, "outputType"),
	);
	return lRenderFunction(
		lDesugar ? await desugar(lStateMachine) : lStateMachine,
		lOptions,
	);
}
export const version = _version;
export function getAllowedValues() {
	return _getAllowedValues();
}
