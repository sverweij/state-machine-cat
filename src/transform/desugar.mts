/* eslint-disable security/detect-object-injection */
import cloneDeep from "lodash/cloneDeep.js";
import reject from "lodash/reject.js";
import type {
  IStateMachine,
  ITransition,
  StateType,
} from "types/state-machine-cat.js";
import StateMachineModel from "../state-machine-model.mjs";
import utl from "./utl.mjs";

type ITransitionMap = {
  [stateName: string]: ITransition[];
};

function fuseTransitionAttribute(
  pIncomingThing: string | undefined,
  pOutgoingThing: string,
  pJoinChar: string
): string {
  return pIncomingThing
    ? `${pIncomingThing}${pJoinChar}${pOutgoingThing}`
    : pOutgoingThing;
}

function fuseIncomingToOutgoing(
  pIncomingTransition: ITransition,
  pOutgoingTransition: ITransition
): ITransition {
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
  pTransitions: ITransition[],
  pPseudoStateNames: string[],
  pOutgoingTransitionMap: ITransitionMap
): ITransition[] {
  return pTransitions.reduce(
    (pAll: ITransition[], pTransition: ITransition) => {
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

function deSugarPseudoStates(
  pMachine: IStateMachine,
  pPseudoStateNames: string[],
  pOutgoingTransitionMap: ITransitionMap
): IStateMachine {
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

function removeStatesCascading(
  pMachine: IStateMachine,
  pStateNames: string[]
): IStateMachine {
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
 */
export default (
  pMachine: IStateMachine,
  pDesugarableStates: StateType[] = ["fork", "junction", "choice"]
): IStateMachine => {
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
