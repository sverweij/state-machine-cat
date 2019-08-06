const _clonedeep = require("lodash.clonedeep");
const _reject = require("lodash.reject");
const StateMachineModel = require("../stateMachineModel");
const utl = require("./utl");

function foldOutgoing(pIncomingTransition, pOutgoingTransition) {
  // in:
  // a => ]: event [condition]/ action;
  // ] => b: / action to b;
  //
  // out:
  // a => b: event [condition]/ action\naction to b;
  //
  // events and conditions are illegal on transitions outgoing
  // from forks, so we ignore them
  if (pIncomingTransition.to === pOutgoingTransition.from) {
    const lRetval = Object.assign({}, pIncomingTransition, {
      to: pOutgoingTransition.to
    });

    if (pOutgoingTransition.action) {
      lRetval.action = lRetval.action
        ? `${lRetval.action}\n${pOutgoingTransition.action}`
        : pOutgoingTransition.action;
      lRetval.label = utl.formatLabel(
        lRetval.event,
        lRetval.cond,
        lRetval.action
      );
    }

    return lRetval;
  }
  return pOutgoingTransition;
}

function deSugarForks(pMachine, pIncomingTransitions) {
  const lMachine = _clonedeep(pMachine);

  if (lMachine.transitions) {
    pIncomingTransitions.forEach(pIncomingTransition => {
      lMachine.transitions = _reject(
        lMachine.transitions,
        utl.isTransitionTo(pIncomingTransition.to)
      ).map(pOutgoingTransition =>
        foldOutgoing(pIncomingTransition, pOutgoingTransition)
      );
    });
  }

  lMachine.states = _reject(lMachine.states, utl.isType("fork")).map(pState =>
    pState.statemachine
      ? Object.assign({}, pState, {
          statemachine: deSugarForks(pState.statemachine, pIncomingTransitions)
        })
      : pState
  );

  return lMachine;
}

/**
 * Takes a state machine and replaces all forks with transitions from its
 * respective inputs and outputs
 *
 * e.g.
 * ```smcat
 *  a => ]: event [condition]/ action;
 * ] => b;
 * ] => c;
 * ```
 *
 * will become
 * ```smcat
 * a => b: event [condition]/ action;
 * a => c: event [condition]/ action;
 * ```
 *
 * @param {IStateMachine} pMachine The state machine still containing forks
 * @returns {IStateMachine}        the transformed state machine
 */
module.exports = pMachine => {
  const lModel = new StateMachineModel(pMachine);
  const lForksIncomingTransitions = lModel
    .findStatesByType("fork")
    .map(pForkState => lModel.findTransitionByTo(pForkState.name));

  return deSugarForks(pMachine, lForksIncomingTransitions);
};
