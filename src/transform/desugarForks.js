const _clonedeep = require("lodash.clonedeep");
const _reject = require("lodash.reject");
const utl = require("./utl");

function foldFromFork(pForkName, pTransitionToFork) {
  return pTransition =>
    pTransition.from === pForkName
      ? Object.assign({}, pTransitionToFork, {
          to: pTransition.to
        })
      : pTransition;
}

function deSugarForks(pMachine, pForkNames = []) {
  const lMachine = _clonedeep(pMachine);
  const lForkNames = pForkNames.concat(
    lMachine.states.filter(utl.isType("fork")).map(pFork => pFork.name)
  );

  if (lMachine.transitions) {
    lForkNames.forEach(pForkName => {
      const lTransitionToFork = lMachine.transitions.find(
        utl.isTransitionTo(pForkName)
      );

      lMachine.transitions = _reject(
        lMachine.transitions,
        utl.isTransitionTo(pForkName)
      ).map(foldFromFork(pForkName, lTransitionToFork));
    });
  }

  lMachine.states = _reject(lMachine.states, utl.isType("fork")).map(pState =>
    pState.statemachine
      ? Object.assign({}, pState, {
          statemachine: deSugarForks(pState.statemachine, lForkNames)
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
 * !caveat! will not properly detect forks declared in lower levels used in higher levels.
 * These cases might yield invalid state machines. Sample of such a machine:
 *
 * ```smcat
 * a {
 *   aa => ]a;
 *   ]a => ab;
 *   ]a => ac;
 * },
 * b;
 *
 * ]a => b;
 * ```
 *
 * @param {IStateMachine} pMachine The state machine still containing forks
 * @returns {IStateMachine}        the transformed state machine
 */
module.exports = deSugarForks;
