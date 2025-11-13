import Ajv from "ajv";
import type {
  IRenderOptions,
  IStateMachine,
} from "types/state-machine-cat.mjs";
import { getOptionValue } from "../options.mjs";
import { parse as parseSmCat } from "./smcat/parse.mjs";
import $schema from "./smcat-ast.schema.mjs";

// @ts-expect-error using Ajv as a class/ constructor is as per the ajv documentation, but tsc seems to think differently
const ajv = new Ajv();
const validate = ajv.compile($schema);
const parseSCXML = async (pScript: string): Promise<IStateMachine> => {
  const { parse } = await import("./scxml/index.mjs");
  return parse(pScript);
};

export async function getAST(
  pScript: string | IStateMachine,
  pOptions: IRenderOptions,
): Promise<IStateMachine> {
  let lReturnValue = pScript;

  if (getOptionValue(pOptions, "inputType") === "smcat") {
    lReturnValue = parseSmCat(pScript as string);
  } else if (getOptionValue(pOptions, "inputType") === "scxml") {
    // @ts-expect-error inputType scxml => it's a string
    lReturnValue = await parseSCXML(pScript);
  } else if (typeof pScript === "string") {
    // json
    lReturnValue = JSON.parse(pScript);
  }

  if (!validate(lReturnValue)) {
    throw new Error(
      `The provided JSON is not a valid state-machine-cat AST: ${ajv.errorsText()}.\n`,
    );
  }

  // @ts-expect-error by here lReturnValue is bound to be an IStateMachine
  return lReturnValue;
}
