import type {
  IRenderOptions,
  IStateMachine,
} from "types/state-machine-cat.mjs";
import { getOptionValue } from "../options.mjs";
import { parse as parseSmCat } from "./smcat/parse.mjs";
import { validate } from "./smcat-ast.validate.mjs";

const parseSCXML = async (pScript: string): Promise<IStateMachine> => {
  const { parse } = await import("./scxml/index.mjs");
  return parse(pScript);
};

export function validateErrorsToString(
  pErrors: { instancePath: string; message: string }[],
): string {
  return pErrors
    .map((pError) => `data${pError.instancePath} ${pError.message}`)
    .join(", ");
}

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
      // @ts-expect-error TS2339 - ts doesn't know validate has an errors property as the (generated) validate function
      // doesn't have types at the moment.
      `The provided JSON is not a valid state-machine-cat AST: ${validateErrorsToString(validate.errors)}.\n`,
    );
  }

  // @ts-expect-error by here lReturnValue is bound to be an IStateMachine
  return lReturnValue;
}
