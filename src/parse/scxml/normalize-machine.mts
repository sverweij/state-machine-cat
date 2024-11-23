import { castArray } from "./utl.mjs";
import type { INormalizedSCXMLMachine, ISCXMLInitialState } from "./scxml.js";

function normalizeInitialFromObject(
  pInitialObject: Partial<ISCXMLInitialState>,
  pId: string,
): ISCXMLInitialState {
  const lReturnValue = {
    // ensure the 'initial' state has a unique name
    id: pId ? `${pId}.initial` : "initial",
  };

  if (pInitialObject.transition) {
    Object.assign(lReturnValue, {
      transition: [pInitialObject.transition],
    });
  }

  return lReturnValue;
}

function normalizeInitialFromString(pString: string): ISCXMLInitialState {
  return {
    id: "initial",
    transition: [
      {
        target: pString,
      },
    ],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeInitial(pMachine: any): ISCXMLInitialState[] {
  const lReturnValue = [];

  if (pMachine.initial) {
    if (typeof pMachine.initial === "string") {
      lReturnValue.push(normalizeInitialFromString(pMachine.initial));
    } else {
      lReturnValue.push(
        normalizeInitialFromObject(pMachine.initial, pMachine.id),
      );
    }
  }
  return lReturnValue;
}

/**
 * Massages SCXML-as-json to be uniform:
 *
 * @param pMachine SCXML-as-json state machine
 * @returns Still an SCXML-as-json state machine,
 * but more consistent and easier to use
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, complexity
export function normalizeMachine(pMachine: any): INormalizedSCXMLMachine {
  return {
    ...pMachine,
    initial: normalizeInitial(pMachine),
    state: castArray(pMachine?.state ?? []),
    parallel: castArray(pMachine?.parallel ?? []),
    history: castArray(pMachine?.history ?? []),
    final: castArray(pMachine?.final ?? []),
  };
}
