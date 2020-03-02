const _get = require("lodash.get");
const _castArray = require("lodash.castarray");

function normalizeInitialFromObject(pMachine) {
  const lRetval = {
    // ensure the 'initial' state has a unique name
    id: pMachine.id ? `${pMachine.id}.initial` : "initial"
  };
  if (pMachine.initial.transition) {
    Object.assign(lRetval, {
      transition: [pMachine.initial.transition]
    });
  }

  return lRetval;
}

function normalizeInitialFromString(pMachine) {
  return {
    id: "initial",
    transition: [
      {
        target: pMachine.initial
      }
    ]
  };
}

function normalizeInitial(pMachine) {
  const lRetval = [];
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
    lRetval.push(lInitialObject);
  }
  return lRetval;
}

/**
 * Massages SCXML-as-json to be uniform:
 * -
 *
 * @param {any} pMachine
 */
function normalizeMachine(pMachine) {
  return Object.assign({}, pMachine, {
    initial: normalizeInitial(pMachine),
    state: _castArray(_get(pMachine, "state", [])),
    parallel: _castArray(_get(pMachine, "parallel", [])),
    history: _castArray(_get(pMachine, "history", [])),
    final: _castArray(_get(pMachine, "final", []))
  });
}

module.exports = normalizeMachine;
