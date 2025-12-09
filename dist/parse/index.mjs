import { getOptionValue } from "../options.mjs";
import { parse as parseSmCat } from "./smcat/parse.mjs";
import { validate } from "./smcat-ast.validate.mjs";
const parseSCXML = async (pScript) => {
	const { parse } = await import("./scxml/index.mjs");
	return parse(pScript);
};
export function validateErrorsToString(pErrors) {
	return (pErrors || [])
		.map((pError) => `data${pError.instancePath} ${pError.message}`)
		.join(", ");
}
export async function getAST(pScript, pOptions) {
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
			`The provided JSON is not a valid state-machine-cat AST: ${validateErrorsToString(validate.errors)}.\n`,
		);
	}
	return lReturnValue;
}
