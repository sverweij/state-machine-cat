import type { IStateMachine } from "types/state-machine-cat.mjs";
import { Counter } from "../../counter.mjs";
import { parse as pegParse } from "./smcat-parser.mjs";

export function parse(pScript: string): IStateMachine {
  return pegParse(pScript, { counter: new Counter() });
}
