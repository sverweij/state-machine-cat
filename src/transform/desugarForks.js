const _clonedeep = require("lodash.clonedeep");
const _reject = require("lodash.reject");
const StateMachineModel = require("../stateMachineModel");
const utl = require("./utl");

function foldOutgoing(pIncomingTransition) {
  return pTransition =>
    pTransition.from === pIncomingTransition.to
      ? Object.assign({}, pIncomingTransition, {
          to: pTransition.to
        })
      : pTransition;
}

function deSugarForks(pMachine, pIncomingTransitions) {
  const lMachine = _clonedeep(pMachine);

  if (lMachine.transitions) {
    pIncomingTransitions.forEach(pIncomingTransition => {
      lMachine.transitions = _reject(
        lMachine.transitions,
        utl.isTransitionTo(pIncomingTransition.to)
      ).map(foldOutgoing(pIncomingTransition));
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
 *  a => ];
 * ] => b;
 * ] => c;
 * ```
 *
 * will become
 * ```smcat
 * a => b;
 * a => c;
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
