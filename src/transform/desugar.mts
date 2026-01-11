/* eslint-disable security/detect-object-injection */
import type {
  IStateMachine,
  ITransition,
  StateType,
} from "types/state-machine-cat.mjs";
import StateMachineModel from "../state-machine-model.mjs";
import { Counter } from "../counter.mjs";
import { formatLabel } from "./utl.mjs";

type ITransitionMap = {
  [stateName: string]: ITransition[];
};

function fuseTransitionAttribute(
  pIncomingThing: string | undefined,
  pOutgoingThing: string,
  pJoinChar: string,
): string {
  return pIncomingThing
    ? `${pIncomingThing}${pJoinChar}${pOutgoingThing}`
    : pOutgoingThing;
}

function fuseIncomingToOutgoing(
  pIncomingTransition: ITransition,
  pOutgoingTransition: ITransition,
  pCounter: Counter,
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
  const lReturnValue = {
    ...pIncomingTransition,
    ...pOutgoingTransition,
    from: pIncomingTransition.from,
    to: pOutgoingTransition.to,
    id: pCounter.next(),
  };

  if (pOutgoingTransition.action) {
    lReturnValue.action = fuseTransitionAttribute(
      pIncomingTransition.action,
      pOutgoingTransition.action,
      "\n",
    );
  }
  if (lReturnValue.event || lReturnValue.cond || lReturnValue.action) {
    lReturnValue.label = formatLabel(
      lReturnValue.event,
      lReturnValue.cond,
      lReturnValue.action,
    );
  }

  return lReturnValue;
}

// eslint-disable-next-line complexity
function fuseTransitions(
  pTransitions: ITransition[],
  pPseudoStateNames: string[],
  pOutgoingTransitionMap: ITransitionMap,
  pCounter: Counter,
): ITransition[] {
  const lResult: ITransition[] = [];

  for (const lTransition of pTransitions) {
    let lAdded = false;
    for (const lStateName of pPseudoStateNames) {
      if (lStateName === lTransition.to && pOutgoingTransitionMap[lStateName]) {
        // eslint-disable-next-line max-depth
        for (const lOutgoing of pOutgoingTransitionMap[lStateName]) {
          lResult.push(
            fuseIncomingToOutgoing(lTransition, lOutgoing, pCounter),
          );
        }
        lAdded = true;
      }
    }
    if (!lAdded) {
      lResult.push(lTransition);
    }
  }

  return lResult;
}

function deSugarPseudoStates(
  pMachine: IStateMachine,
  pPseudoStateNames: string[],
  pOutgoingTransitionMap: ITransitionMap,
  pCounter: Counter,
): IStateMachine {
  const lMachine = structuredClone(pMachine);

  if (lMachine.transitions && pPseudoStateNames.length > 0) {
    lMachine.transitions = fuseTransitions(
      lMachine.transitions,
      pPseudoStateNames,
      pOutgoingTransitionMap,
      pCounter,
    );
  }

  lMachine.states = lMachine.states.map((pState) =>
    pState.statemachine
      ? {
          ...pState,
          statemachine: deSugarPseudoStates(
            pState.statemachine,
            pPseudoStateNames,
            pOutgoingTransitionMap,
            pCounter,
          ),
        }
      : pState,
  );

  return lMachine;
}

function removeStatesCascading(
  pMachine: IStateMachine,
  pStateNames: string[],
): IStateMachine {
  const lMachine = structuredClone(pMachine);

  if (lMachine.transitions) {
    lMachine.transitions = lMachine.transitions.filter(
      (pTransition) =>
        !pStateNames.some(
          (pJunctionStateName) =>
            pJunctionStateName === pTransition.from ||
            pJunctionStateName === pTransition.to,
        ),
    );
  }

  lMachine.states = lMachine.states
    .filter((pState) => !pStateNames.includes(pState.name))
    .map((pState) =>
      pState.statemachine
        ? {
            ...pState,
            statemachine: removeStatesCascading(
              pState.statemachine,
              pStateNames,
            ),
          }
        : pState,
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
function desugar(
  pMachine: IStateMachine,
  pDesugarableStates: StateType[] = ["fork", "junction", "choice"],
): IStateMachine {
  const lModel = new StateMachineModel(pMachine);

  const lPseudoStateNames = lModel
    .findStatesByTypes(pDesugarableStates)
    .map(({ name }) => name);

  const lOutgoingTransitionMap: ITransitionMap = lPseudoStateNames.reduce(
    (pAll, pStateName) => {
      pAll[pStateName] = lModel.findTransitionsByFrom(pStateName);
      return pAll;
    },
    {},
  );
  const lMaximumTransitionId = lModel.getMaximumTransitionId();

  const lMachine = deSugarPseudoStates(
    pMachine,
    lPseudoStateNames,
    lOutgoingTransitionMap,
    new Counter(lMaximumTransitionId),
  );

  return removeStatesCascading(lMachine, lPseudoStateNames);
}

export default desugar;
