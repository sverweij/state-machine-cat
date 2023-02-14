import options from "./options.mjs";
import parse from "./parse/index.mjs";
import desugar from "./transform/desugar.mjs";
import getRenderFunction from "./render/index.mjs";
import { version as _version } from "./version.mjs";
export function render(pScript, pOptions) {
    const lStateMachine = parse.getAST(pScript, pOptions);
    const lDesugar = options.getOptionValue(pOptions, "desugar");
    return getRenderFunction(options.getOptionValue(pOptions, "outputType"))(lDesugar ? desugar(lStateMachine) : lStateMachine, pOptions);
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
