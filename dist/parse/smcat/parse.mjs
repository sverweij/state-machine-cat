import { Counter } from "../../counter.mjs";
import { parse as pegParse } from "./smcat-parser.mjs";
export function parse(pScript) {
	return pegParse(pScript, { counter: new Counter() });
}
