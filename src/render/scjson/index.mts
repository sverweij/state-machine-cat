/* eslint-disable security/detect-object-injection */
import type {
  ActionTypeType,
  IActionType,
  IRenderOptions,
  IState,
  IStateMachine,
  ITransition,
} from "types/state-machine-cat.js";
import StateMachineModel from "../../state-machine-model.mjs";
import type {
  ISCJSONMachine,
  ISCJSONState,
  ISCJSONTransition,
} from "./scjson.js";
import makeValidXMLName from "./make-valid-xml-name.mjs";
import makeValidEventNames from "./make-valid-event-names.mjs";

const STATE_TYPE2SCXML_STATE_KIND: { [stateType: string]: string } = {
  regular: "state",
  initial: "initial",
  final: "final",
  terminate: "final",
  parallel: "parallel",
  history: "history",
  deephistory: "history",
};

function stateType2SCXMLStateKind(pStateType: string): string {
  return STATE_TYPE2SCXML_STATE_KIND[pStateType] || "state";
}

function transformTransition(pTransition: ITransition): ISCJSONTransition {
  const lReturnValue: ISCJSONTransition = {
    target: makeValidXMLName(pTransition.to),
  };

  if (pTransition.event) {
    lReturnValue.event = makeValidEventNames(pTransition.event);
  }
  if (pTransition.cond) {
    lReturnValue.cond = pTransition.cond;
  }
  if (pTransition.action) {
    lReturnValue.action = pTransition.action;
  }
  if (pTransition.type) {
    lReturnValue.type = pTransition.type;
  }
  return lReturnValue;
}

function extractTriggers(
  pTriggers: IActionType[],
  pTriggerType: ActionTypeType,
): string[] {
  return pTriggers
    .filter((pTrigger) => pTrigger.type === pTriggerType)
    .map((pTrigger) => pTrigger.body);
}

function pullOutActionType(
  pReturnValue: ISCJSONState,
  pTriggersType: "onentries" | "onexits",
  pActions: IActionType[],
  pActionType: ActionTypeType,
): void {
  const lTriggerArray: string[] = extractTriggers(pActions, pActionType);

  if (lTriggerArray.length > 0) {
    pReturnValue[pTriggersType] = (pReturnValue[pTriggersType] || []).concat(
      lTriggerArray,
    );
  }
}

function transformTriggers(pReturnValue: ISCJSONState, pState: IState): void {
  if (pState.actions) {
    pullOutActionType(pReturnValue, "onentries", pState.actions, "entry");
    pullOutActionType(pReturnValue, "onentries", pState.actions, "activity");
    pullOutActionType(pReturnValue, "onexits", pState.actions, "exit");
  }
}

function transformTransitions(
  pReturnValue: ISCJSONState,
  pState: IState,
  pTransitions: ITransition[],
): void {
  const lTransitions = pTransitions
    .filter((pTransition) => pTransition.from === pState.name)
    .map(transformTransition);

  if (lTransitions.length > 0) {
    pReturnValue.transitions = lTransitions;
  }
}

function transformCompositeState(
  pReturnValue: ISCJSONState,
  pState: IState,
  pTransitions: ITransition[],
): void {
  if (pState.statemachine) {
    // recursion, so ...
    // eslint-disable-next-line no-use-before-define, no-undefined
    const lRenderedState = render(pState.statemachine, undefined, pTransitions);

    pReturnValue.states = (pReturnValue.states || []).concat(
      lRenderedState.states,
    );
    if (lRenderedState.initial) {
      pReturnValue.initial = lRenderedState.initial;
    }
  }
}

function transformState(pTransitions: ITransition[]) {
  pTransitions = pTransitions || [];

  return (pState: IState): ISCJSONState => {
    const lReturnValue: ISCJSONState = {
      kind: stateType2SCXMLStateKind(pState.type),
      id: makeValidXMLName(pState.name),
    };

    if (pState.type === "deephistory") {
      // as 'shallow' is the default anyway, we leave it out
      lReturnValue.type = "deep";
    }

    transformTriggers(lReturnValue, pState);

    transformTransitions(lReturnValue, pState, pTransitions);

    transformCompositeState(lReturnValue, pState, pTransitions);
    return lReturnValue;
  };
}

function findInitialPseudoStateName(
  pStateMachine: IStateMachine,
): string | undefined {
  const lInitial = pStateMachine.states.filter(
    (pState) => pState.type === "initial",
  );

  if (lInitial.length > 0) {
    return lInitial[0].name;
  }
  // eslint-disable-next-line no-undefined
  return undefined;
}

function findInitialStateName(
  pStateMachine: IStateMachine,
  pInitialPseudoStateName?: string,
): string | undefined {
  let lReturnValue = pInitialPseudoStateName;

  if (pInitialPseudoStateName && pStateMachine.transitions) {
    const lInitialTransitions = pStateMachine.transitions.filter(
      (pTransition) => pTransition.from === pInitialPseudoStateName,
    );

    if (lInitialTransitions.length > 0 && !lInitialTransitions[0].action) {
      lReturnValue = lInitialTransitions[0].to;
    }
  }
  return lReturnValue;
}

export default function render(
  pStateMachine: IStateMachine,
  _pOptions?: IRenderOptions,
  pTransitions?: ITransition[],
): ISCJSONMachine {
  const lInitialPseudoStateName = findInitialPseudoStateName(pStateMachine);
  const lInitialStateName = findInitialStateName(
    pStateMachine,
    lInitialPseudoStateName,
  );
  const lReturnValue: ISCJSONMachine = {
    states: pStateMachine.states
      .filter((pState) => {
        if (
          lInitialStateName &&
          lInitialStateName !== lInitialPseudoStateName
        ) {
          return pState.type !== "initial";
        }
        return true;
      })
      .map(
        transformState(
          pTransitions ||
            new StateMachineModel(pStateMachine).flattenedTransitions,
        ),
      ),
  };

  if (lInitialStateName) {
    lReturnValue.initial = makeValidXMLName(lInitialStateName);
  }
  return lReturnValue;
}
