import castArray from "lodash/castArray.js";

/**
 * @param {Partial<import("./scxml").ISCXMLInitialState>} pInitialObject
 * @param {string} [pId]
 * @returns {import("./scxml").ISCXMLInitialState}
 */
function normalizeInitialFromObject(pInitialObject, pId) {
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

/**
 * @param {string} pString
 * @returns {import("./scxml").ISCXMLInitialState}
 */
function normalizeInitialFromString(pString) {
  return {
    id: "initial",
    transition: [
      {
        target: pString,
      },
    ],
  };
}

/**
 * @param {any} pMachine
 * @returns {import("./scxml").ISCXMLInitialState[]}
 */
function normalizeInitial(pMachine) {
  const lReturnValue = [];

  if (pMachine.initial) {
    if (typeof pMachine.initial === "string") {
      lReturnValue.push(normalizeInitialFromString(pMachine.initial));
    } else {
      lReturnValue.push(
        normalizeInitialFromObject(pMachine.initial, pMachine.id)
      );
    }
  }
  return lReturnValue;
}

/**
 * Massages SCXML-as-json to be uniform:
 *
 * @param {any} pMachine SCXML-as-json state machine
 * @returns {import("./scxml").INormalizedSCXMLMachine} Still an SCXML-as-json state machine,
 * but more consistent and easier to use
 */
export function normalizeMachine(pMachine) {
  return {
    ...pMachine,
    initial: normalizeInitial(pMachine),
    state: castArray(pMachine?.state ?? []),
    parallel: castArray(pMachine?.parallel ?? []),
    history: castArray(pMachine?.history ?? []),
    final: castArray(pMachine?.final ?? []),
  };
}
