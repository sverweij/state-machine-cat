const _clonedeep = require("lodash.clonedeep");
const _reject = require("lodash.reject");
const StateMachineModel = require("../stateMachineModel");
const utl = require("./utl");

function fuseTransitionAttribute(pIncomingThing, pOutgoingThing, pJoinChar) {
  return pIncomingThing
    ? `${pIncomingThing}${pJoinChar}${pOutgoingThing}`
    : pOutgoingThing;
}
function fuseIncomingToOutgoing(pIncomingTransition, pOutgoingTransition) {
  // in:
  // a => ]: event [condition]/ action;
  // ] => b: event_to_b [condition_to_b]/ action to b;
  //
  // out:
  // a => b: event [condition]/ action\naction to b;
  //
  // events and conditions are illegal on transitions outgoing
  // from forks, so we ignore them
  const lRetval = Object.assign({}, pIncomingTransition, pOutgoingTransition, {
    from: pIncomingTransition.from,
    to: pOutgoingTransition.to
  });

  if (pOutgoingTransition.action) {
    lRetval.action = fuseTransitionAttribute(
      pIncomingTransition.action,
      pOutgoingTransition.action,
      "\n"
    );
  }
  if (lRetval.event || lRetval.cond || lRetval.action) {
    lRetval.label = utl.formatLabel(
      lRetval.event,
      lRetval.cond,
      lRetval.action
    );
  }

  return lRetval;
}

function fuseTransitions(
  pTransitions,
  pPseudoStateNames,
  pOutgoingTransitionMap
) {
  return pTransitions.reduce((pAll, pTransition) => {
    pPseudoStateNames.forEach((pStateName, pIndex) => {
      if (pStateName === pTransition.to && pOutgoingTransitionMap[pStateName]) {
        pAll = pAll.concat(
          pOutgoingTransitionMap[pStateName].map(pOutgoingTransition =>
            fuseIncomingToOutgoing(pTransition, pOutgoingTransition)
          )
        );
      } else {
        pAll = pIndex === 0 ? pAll.concat(pTransition) : pAll;
      }
    });
    return pAll;
  }, []);
}

function deSugarPseudoStates(
  pMachine,
  pPseudoStateNames,
  pOutgoingTransitionMap
) {
  const lMachine = _clonedeep(pMachine);

  if (lMachine.transitions && pPseudoStateNames.length > 0) {
    lMachine.transitions = fuseTransitions(
      lMachine.transitions,
      pPseudoStateNames,
      pOutgoingTransitionMap
    );
  }

  lMachine.states = lMachine.states.map(pState =>
    pState.statemachine
      ? Object.assign({}, pState, {
          statemachine: deSugarPseudoStates(
            pState.statemachine,
            pPseudoStateNames,
            pOutgoingTransitionMap
          )
        })
      : pState
  );

  return lMachine;
}

function removeStatesCascading(pMachine, pStateNames) {
  const lMachine = _clonedeep(pMachine);

  if (lMachine.transitions) {
    lMachine.transitions = _reject(lMachine.transitions, pTransition =>
      pStateNames.some(
        pJunctionStateName =>
          pJunctionStateName === pTransition.from ||
          pJunctionStateName === pTransition.to
      )
    );
  }

  lMachine.states = _reject(lMachine.states, pState =>
    pStateNames.some(pStateName => pStateName === pState.name)
  ).map(pState =>
    pState.statemachine
      ? Object.assign({}, pState, {
          statemachine: removeStatesCascading(pState.statemachine, pStateNames)
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
 * a => ];
 * b => ];
 * ] => c;
 * ] => d;
 * ```
 *
 * will become
 * ```smcat
 * a => c;
 * a => d;
 * b => c;
 * b => d;
 * ```
 *
 * @param {IStateMachine} pMachine The state machine still containing forks
 * @returns {IStateMachine}        the transformed state machine
 */
module.exports = (
  pMachine,
  pDesugarableStates = ["fork", "junction", "choice"]
) => {
  const lModel = new StateMachineModel(pMachine);
  const lPseudoStateNames = lModel
    .findStatesByTypes(pDesugarableStates)
    .map(pState => pState.name);

  const lOutgoingTransitionMap = lPseudoStateNames.reduce(
    (pAll, pStateName) => {
      pAll[pStateName] = lModel.findTransitionsByFrom(pStateName);
      return pAll;
    },
    {}
  );

  const lMachine = deSugarPseudoStates(
    pMachine,
    lPseudoStateNames,
    lOutgoingTransitionMap
  );
  return removeStatesCascading(lMachine, lPseudoStateNames);
};
