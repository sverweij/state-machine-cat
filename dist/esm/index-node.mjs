import options from "./options.mjs";
import parse from "./parse/index.mjs";
import desugar from "./transform/desugar.mjs";
import getRenderFunction from "./render/index-node.mjs";
import { version } from "./version.mjs";
export default {
    render(pScript, pOptions) {
        const lStateMachine = parse.getAST(pScript, pOptions);
        const lDesugar = options.getOptionValue(pOptions, "desugar");
        return getRenderFunction(options.getOptionValue(pOptions, "outputType"))(lDesugar ? desugar(lStateMachine) : lStateMachine, pOptions);
    },
    version,
    getAllowedValues() {
        return options.getAllowedValues();
    },
};
