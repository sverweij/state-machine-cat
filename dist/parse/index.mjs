import Ajv from "ajv";
import { getOptionValue } from "../options.mjs";
import { parse as parseSmCat } from "./smcat/parse.mjs";
import $schema from "./smcat-ast.schema.mjs";
const ajv = new Ajv();
const validate = ajv.compile($schema);
const parseSCXML = async (pScript) => {
	const { parse } = await import("./scxml/index.mjs");
	return parse(pScript);
};
export default {
	async getAST(pScript, pOptions) {
		let lReturnValue = pScript;
		if (getOptionValue(pOptions, "inputType") === "smcat") {
			lReturnValue = parseSmCat(pScript);
		} else if (getOptionValue(pOptions, "inputType") === "scxml") {
			lReturnValue = await parseSCXML(pScript);
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
