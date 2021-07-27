import _get from "lodash.get";
import _castArray from "lodash.castarray";

function normalizeInitialFromObject(pMachine) {
  const lReturnValue = {
    // ensure the 'initial' state has a unique name
    id: pMachine.id ? `${pMachine.id}.initial` : "initial",
  };

  if (pMachine.initial.transition) {
    Object.assign(lReturnValue, {
      transition: [pMachine.initial.transition],
    });
  }

  return lReturnValue;
}

function normalizeInitialFromString(pMachine) {
  return {
    id: "initial",
    transition: [
      {
        target: pMachine.initial,
      },
    ],
  };
}

function normalizeInitial(pMachine) {
  const lReturnValue = [];
  let lInitialObject = {};

  if (pMachine.initial) {
    // => it's an xml node. This detection isn't fool proof...;
    // if it's a node but it doesn't have a transtion (which
    // looks like an odd corner case) we won't recognize the
    // initial
    // the initial.id shouldn't occur (not allowed in scxml
    // land), but smcat scxml renderer generates it nonetheless
    if (pMachine.initial.transition || pMachine.initial.id) {
      lInitialObject = normalizeInitialFromObject(pMachine);
    } else {
      lInitialObject = normalizeInitialFromString(pMachine);
    }
    lReturnValue.push(lInitialObject);
  }
  return lReturnValue;
}

/**
 * Massages SCXML-as-json to be uniform:
 * -
 *
 * @param {any} pMachine SCXML-as-json state machine
 * @returns {any} Still an SCXML-as-json state machine, but more consistent and
 *                easier to use
 */
export default function normalizeMachine(pMachine) {
  return {
    ...pMachine,
    initial: normalizeInitial(pMachine),
    state: _castArray(_get(pMachine, "state", [])),
    parallel: _castArray(_get(pMachine, "parallel", [])),
    history: _castArray(_get(pMachine, "history", [])),
    final: _castArray(_get(pMachine, "final", [])),
  };
}
