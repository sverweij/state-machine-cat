import Ajv from "ajv";
import options from "../options.mjs";
import { parse as parseSmCat } from "./smcat/parse.mjs";
import { parse as parseSCXML } from "./scxml/index.mjs";
import $schema from "./smcat-ast.schema.mjs";
const ajv = new Ajv();
const validate = ajv.compile($schema);
export default {
	getAST(pScript, pOptions) {
		let lReturnValue = pScript;
		if (options.getOptionValue(pOptions, "inputType") === "smcat") {
			lReturnValue = parseSmCat(pScript);
		} else if (options.getOptionValue(pOptions, "inputType") === "scxml") {
			lReturnValue = parseSCXML(pScript);
		} else if (typeof pScript === "string") {
			lReturnValue = JSON.parse(pScript);
		}
		if (!validate(lReturnValue)) {
			throw new Error(
				`The provided JSON is not a valid state-machine-cat AST: ${ajv.errorsText()}.\n`,
			);
		}
		return lReturnValue;
	},
};
