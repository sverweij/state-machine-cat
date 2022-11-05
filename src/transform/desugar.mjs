// @ts-check
/* eslint-disable security/detect-object-injection */
import cloneDeep from "lodash/cloneDeep.js";
import reject from "lodash/reject.js";
import StateMachineModel from "../state-machine-model.mjs";
import utl from "./utl.mjs";

/**
 * @typedef {{[stateName: string]: import("../../types/state-machine-cat.js").ITransition[]}} ITransitionMap
 */

/**
 * @param {string|undefined} pIncomingThing
 * @param {string} pOutgoingThing
 * @param {string} pJoinChar
 * @returns {string}
 */
function fuseTransitionAttribute(pIncomingThing, pOutgoingThing, pJoinChar) {
  return pIncomingThing
    ? `${pIncomingThing}${pJoinChar}${pOutgoingThing}`
    : pOutgoingThing;
}

/**
 * @param {import("../../types/state-machine-cat.js").ITransition} pIncomingTransition
 * @param {import("../../types/state-machine-cat.js").ITransition} pOutgoingTransition
 * @returns {import("../../types/state-machine-cat.js").ITransition}
 */
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
  /** @type {import("../../types/state-machine-cat.js").ITransition} */
  const lReturnValue = {
    ...pIncomingTransition,
    ...pOutgoingTransition,
    from: pIncomingTransition.from,
    to: pOutgoingTransition.to,
  };

  if (pOutgoingTransition.action) {
    lReturnValue.action = fuseTransitionAttribute(
      pIncomingTransition.action,
      pOutgoingTransition.action,
      "\n"
    );
  }
  if (lReturnValue.event || lReturnValue.cond || lReturnValue.action) {
    lReturnValue.label = utl.formatLabel(
      lReturnValue.event,
      lReturnValue.cond,
      lReturnValue.action
    );
  }

  return lReturnValue;
}

/**
 * @param {import("../../types/state-machine-cat.js").ITransition[]} pTransitions
 * @param {string[]} pPseudoStateNames
 * @param {ITransitionMap} pOutgoingTransitionMap
 * @returns {import("../../types/state-machine-cat.js").ITransition[]}
 */
function fuseTransitions(
  pTransitions,
  pPseudoStateNames,
  pOutgoingTransitionMap
) {
  return pTransitions.reduce(
    /**
     * @param {import("../../types/state-machine-cat.js").ITransition[]} pAll
     * @param {import("../../types/state-machine-cat.js").ITransition} pTransition
     * @returns {import("../../types/state-machine-cat.js").ITransition[]}
     */
    (pAll, pTransition) => {
      pPseudoStateNames.forEach((pStateName, pIndex) => {
        if (
          pStateName === pTransition.to &&
          pOutgoingTransitionMap[pStateName]
        ) {
          pAll = pAll.concat(
            pOutgoingTransitionMap[pStateName].map((pOutgoingTransition) =>
              fuseIncomingToOutgoing(pTransition, pOutgoingTransition)
            )
          );
        } else {
          pAll = pIndex === 0 ? pAll.concat(pTransition) : pAll;
        }
      });
      return pAll;
    },
    []
  );
}

/**
 * @param {import("../../types/state-machine-cat.js").IStateMachine} pMachine
 * @param {string[]} pPseudoStateNames
 * @param {ITransitionMap} pOutgoingTransitionMap
 * @returns {import("../../types/state-machine-cat.js").IStateMachine}
 */
function deSugarPseudoStates(
  pMachine,
  pPseudoStateNames,
  pOutgoingTransitionMap
) {
  const lMachine = cloneDeep(pMachine);

  if (lMachine.transitions && pPseudoStateNames.length > 0) {
    lMachine.transitions = fuseTransitions(
      lMachine.transitions,
      pPseudoStateNames,
      pOutgoingTransitionMap
    );
  }

  lMachine.states = lMachine.states.map((pState) =>
    pState.statemachine
      ? {
          ...pState,
          statemachine: deSugarPseudoStates(
            pState.statemachine,
            pPseudoStateNames,
            pOutgoingTransitionMap
          ),
        }
      : pState
  );

  return lMachine;
}

/**
 * @param {import("../../types/state-machine-cat.js").IStateMachine} pMachine
 * @param {string[]} pStateNames
 * @returns {import("../../types/state-machine-cat.js").IStateMachine}
 */
function removeStatesCascading(pMachine, pStateNames) {
  const lMachine = cloneDeep(pMachine);

  if (lMachine.transitions) {
    lMachine.transitions = reject(lMachine.transitions, (pTransition) =>
      pStateNames.some(
        (pJunctionStateName) =>
          pJunctionStateName === pTransition.from ||
          pJunctionStateName === pTransition.to
      )
    );
  }

  lMachine.states = reject(lMachine.states, (pState) =>
    pStateNames.includes(pState.name)
  ).map((pState) =>
    pState.statemachine
      ? {
          ...pState,
          statemachine: removeStatesCascading(pState.statemachine, pStateNames),
        }
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
 * @param {import("../../types/state-machine-cat.js").IStateMachine} pMachine The state machine still containing forks
 * @param {import("../../types/state-machine-cat.js").StateType[]} pDesugarableStates array of de-sugarable states
 * @returns {import("../../types/state-machine-cat.js").IStateMachine} the transformed state machine
 */
export default (
  pMachine,
  pDesugarableStates = ["fork", "junction", "choice"]
) => {
  const lModel = new StateMachineModel(pMachine);

  /** @type {string[]} */
  const lPseudoStateNames = lModel
    .findStatesByTypes(pDesugarableStates)
    .map(({ name }) => name);

  /** @type {ITransitionMap} */
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
