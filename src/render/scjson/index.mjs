/* eslint-disable security/detect-object-injection */
import StateMachineModel from "../../state-machine-model.mjs";
import makeValidXMLName from "./make-valid-xml-name.mjs";
import makeValidEventNames from "./make-valid-event-names.mjs";

const STATE_TYPE2SCXML_STATE_KIND = {
  regular: "state",
  initial: "initial",
  final: "final",
  terminate: "final",
  parallel: "parallel",
  history: "history",
  deephistory: "history",
};

function stateType2SCXMLStateKind(pStateType) {
  return STATE_TYPE2SCXML_STATE_KIND[pStateType] || "state";
}

function transformTransition(pTransition) {
  const lReturnValue = {
    target: makeValidXMLName(pTransition.to),
  };

  if (Boolean(pTransition.event)) {
    lReturnValue.event = makeValidEventNames(pTransition.event);
  }
  if (Boolean(pTransition.cond)) {
    lReturnValue.cond = pTransition.cond;
  }
  if (Boolean(pTransition.action)) {
    lReturnValue.action = pTransition.action;
  }
  if (Boolean(pTransition.type)) {
    lReturnValue.type = pTransition.type;
  }
  return lReturnValue;
}

function extractTriggers(pTriggers, pTriggerType) {
  return pTriggers
    .filter((pTrigger) => pTrigger.type === pTriggerType)
    .map((pTrigger) => pTrigger.body);
}

function pullOutActionType(pReturnValue, pTriggersType, pActions, pActionType) {
  const lTriggerArray = extractTriggers(pActions, pActionType);

  if (lTriggerArray.length > 0) {
    pReturnValue[pTriggersType] = (pReturnValue[pTriggersType] || []).concat(
      lTriggerArray
    );
  }
}

function transformTriggers(pReturnValue, pState) {
  if (Boolean(pState.actions)) {
    pullOutActionType(pReturnValue, "onentries", pState.actions, "entry");
    pullOutActionType(pReturnValue, "onentries", pState.actions, "activity");
    pullOutActionType(pReturnValue, "onexits", pState.actions, "exit");
  }
}

function transformTransitions(pReturnValue, pState, pTransitions) {
  const lTransitions = pTransitions
    .filter((pTransition) => pTransition.from === pState.name)
    .map(transformTransition);

  if (lTransitions.length > 0) {
    pReturnValue.transitions = lTransitions;
  }
}

function transformCompositeState(pReturnValue, pState, pTransitions) {
  if (Boolean(pState.statemachine)) {
    // recursion, so ...
    // eslint-disable-next-line no-use-before-define
    const lRenderedState = render(pState.statemachine, null, pTransitions);

    pReturnValue.states = (pReturnValue.states || []).concat(
      lRenderedState.states
    );
    if (lRenderedState.initial) {
      pReturnValue.initial = lRenderedState.initial;
    }
  }
}

function transformState(pTransitions) {
  pTransitions = pTransitions || [];

  return (pState) => {
    const lReturnValue = {
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

function findInitialPseudoStateName(pStateMachine) {
  let lReturnValue = null;

  const lInitial = pStateMachine.states.filter(
    (pState) => pState.type === "initial"
  );

  if (lInitial.length > 0) {
    lReturnValue = lInitial[0].name;
  }
  return lReturnValue;
}

function findInitialStateName(pStateMachine, pInitialPseudoStateName) {
  let lReturnValue = pInitialPseudoStateName;

  if (pInitialPseudoStateName && pStateMachine.transitions) {
    const lInitialTransitions = pStateMachine.transitions.filter(
      (pTransition) => pTransition.from === pInitialPseudoStateName
    );

    if (lInitialTransitions.length > 0 && !lInitialTransitions[0].action) {
      lReturnValue = lInitialTransitions[0].to;
    }
  }
  return lReturnValue;
}

export default function render(pStateMachine, _pOptions, pTransitions) {
  const lInitialPseudoStateName = findInitialPseudoStateName(pStateMachine);
  const lInitialStateName = findInitialStateName(
    pStateMachine,
    lInitialPseudoStateName
  );
  const lReturnValue = {
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
            new StateMachineModel(pStateMachine).flattenedTransitions
        )
      ),
  };

  if (lInitialStateName) {
    lReturnValue.initial = makeValidXMLName(lInitialStateName);
  }
  return lReturnValue;
}
