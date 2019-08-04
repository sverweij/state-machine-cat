const _clonedeep = require("lodash.clonedeep");
const _reject = require("lodash.reject");
const utl = require("./utl");

function foldToJoin(pForkName, pTransitionFromJoin) {
  return pTransition =>
    pTransition.to === pForkName
      ? Object.assign({}, pTransition, {
          to: pTransitionFromJoin.to
        })
      : pTransition;
}

function deSugarJoins(pMachine, pJoinNames = []) {
  const lMachine = _clonedeep(pMachine);
  const lJoinNames = pJoinNames.concat(
    lMachine.states.filter(utl.isType("join")).map(pJoin => pJoin.name)
  );

  if (lMachine.transitions) {
    lJoinNames.forEach(pJoinName => {
      const lTransitionFromJoin = lMachine.transitions.find(
        utl.isTransitionFrom(pJoinName)
      );

      lMachine.transitions = _reject(
        lMachine.transitions,
        utl.isTransitionFrom(pJoinName)
      ).map(foldToJoin(pJoinName, lTransitionFromJoin));
    });
  }

  lMachine.states = _reject(lMachine.states, utl.isType("join")).map(pState =>
    pState.statemachine
      ? Object.assign({}, pState, {
          statemachine: deSugarJoins(pState.statemachine, lJoinNames)
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
 * !caveat! will not properly detect joins declared in lower levels used in higher levels.
 * These cases might yield invalid state machines. Sample of such a machine:
 *
 * ```smcat
 * a {
 *   aa => ]a;
 *   ab => ]a;
 *   ]a => ac;
 * },
 * b;
 *
 * b => ]a;
 * ```
 *
 * @param {IStateMachine} pMachine The state machine still containing joins
 * @returns {IStateMachine}        the transformed state machine
 */
module.exports = deSugarJoins;
