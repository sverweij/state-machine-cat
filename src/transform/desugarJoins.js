const _clonedeep = require("lodash.clonedeep");
const _reject = require("lodash.reject");
const StateMachineModel = require("../stateMachineModel");
const utl = require("./utl");

// TODO: can likely be merged with the similar function
// in desugarForks.js
function foldIncoming(pOutgoingTransition) {
  return pIncomingTransition => {
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
    return pIncomingTransition;
  };
}

function deSugarJoins(pMachine, pOutgoingTransitions) {
  const lMachine = _clonedeep(pMachine);

  if (lMachine.transitions) {
    pOutgoingTransitions.forEach(pOutgoingTransition => {
      lMachine.transitions = _reject(
        lMachine.transitions,
        utl.isTransitionFrom(pOutgoingTransition.from)
      ).map(foldIncoming(pOutgoingTransition));
    });
  }

  lMachine.states = _reject(lMachine.states, utl.isType("join")).map(pState =>
    pState.statemachine
      ? Object.assign({}, pState, {
          statemachine: deSugarJoins(pState.statemachine, pOutgoingTransitions)
        })
      : pState
  );

  return lMachine;
}
/**
 * Takes a state machine and replaces all joins with transitions to its
 * respective inputs and outputs
 *
 * e.g.
 * ```smcat
 *  a => ];
 *  b => ];
 * ] => c;
 * ```
 *
 * will become
 * ```smcat
 * a => c;
 * b => c;
 * ```
 *
 * @param {IStateMachine} pMachine The state machine still containing joins
 * @returns {IStateMachine}        the transformed state machine
 */
module.exports = module.exports = pMachine => {
  const lModel = new StateMachineModel(pMachine);
  const lJoinsOutgoingTransitions = lModel
    .findStatesByType("join")
    .map(pJoinState => lModel.findTransitionByFrom(pJoinState.name));

  return deSugarJoins(pMachine, lJoinsOutgoingTransitions);
};
