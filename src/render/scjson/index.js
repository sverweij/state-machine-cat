const StateMachineModel = require('../../stateMachineModel');
const makeValidXMLName  = require('./makeValidXMLName');
const makeValidEventNames  = require('./makeValidEventNames');

const STATE_TYPE2SCXML_STATE_KIND = {
    regular     : "state",
    initial     : "initial",
    final       : "final",
    terminate   : "final",
    parallel    : "parallel",
    history     : "history",
    deephistory : "history"
};

function stateType2SCXMLStateKind (pStateType) {
    return STATE_TYPE2SCXML_STATE_KIND[pStateType] || "state";
}

function transformTransition(pTransition){
    const lRetval = {
        target: makeValidXMLName(pTransition.to)
    };

    if (Boolean(pTransition.event)){
        lRetval.event = makeValidEventNames(pTransition.event);
    }
    if (Boolean(pTransition.cond)){
        lRetval.cond = pTransition.cond;
    }
    if (Boolean(pTransition.action)){
        lRetval.action = pTransition.action;
    }
    return lRetval;
}

function extractTriggers(pTriggers, pTriggerType) {
    return pTriggers
        .filter((pTrigger) => pTrigger.type === pTriggerType)
        .map((pTrigger) => pTrigger.body);
}

function pullOutActionType(pRetval, pTriggersType, pActions, pActionType) {
    const lTriggerArray = extractTriggers(pActions, pActionType);

    if (lTriggerArray.length > 0){
        pRetval[pTriggersType] = (pRetval[pTriggersType] || []).concat(lTriggerArray);
    }
}

function transformTriggers(pRetval, pState) {

    if (Boolean(pState.actions)) {
        pullOutActionType(pRetval, "onentries", pState.actions, "entry");
        pullOutActionType(pRetval, "onentries", pState.actions, "activity");
        pullOutActionType(pRetval, "onexits", pState.actions, "exit");
    }
}

function transformTransitions(pRetval, pState, pTransitions) {
    const lTransitions =
            pTransitions
                .filter((pTransition) => pTransition.from === pState.name)
                .map(transformTransition);
    if (lTransitions.length > 0) {
        pRetval.transitions = lTransitions;
    }
}

function transformCompositeState(pRetval, pState, pTransitions) {
    if (Boolean(pState.statemachine)) {
        const lRenderedState = render(pState.statemachine, null, pTransitions);
        pRetval.states = (pRetval.states || []).concat(lRenderedState.states);
        if (lRenderedState.initial) {
            pRetval.initial = lRenderedState.initial;
        }
    }
}

function transformState(pTransitions) {
    pTransitions = pTransitions || [];

    return function (pState){
        const lRetval = {
            kind: stateType2SCXMLStateKind(pState.type),
            id: makeValidXMLName(pState.name)
        };

        if (pState.type === "deephistory") {
            // as 'shallow' is the default anyway, we leave it out
            lRetval.type = "deep";
        }

        transformTriggers(lRetval, pState);

        transformTransitions(lRetval, pState, pTransitions);

        transformCompositeState(lRetval, pState, pTransitions);
        return lRetval;
    };
}

function findInitialPseudoStateName(pStateMachine) {
    let lRetval = null;

    const lInitial = pStateMachine.states.filter((pState) => pState.type === "initial");
    if (lInitial.length > 0) {
        lRetval = lInitial[0].name;
    }
    return lRetval;
}

function findInitialStateName(pStateMachine, pInitialPseudoStateName) {
    let lRetval = pInitialPseudoStateName;

    if (pInitialPseudoStateName && pStateMachine.transitions) {
        const lInitialTransitions =
            pStateMachine
                .transitions
                .filter(
                    (pTransition) => pTransition.from === pInitialPseudoStateName
                );
        if (lInitialTransitions.length > 0 && !lInitialTransitions[0].action) {
            lRetval = lInitialTransitions[0].to;
        }
    }
    return lRetval;
}

function render(pStateMachine, pOptions, pTransitions) {
    const lInitialPseudoStateName = findInitialPseudoStateName(pStateMachine);
    const lInitialStateName = findInitialStateName(pStateMachine, lInitialPseudoStateName);
    const lRetval = {
        states: pStateMachine
            .states
            .filter(
                (pState) => {
                    if (
                        lInitialStateName &&
                        lInitialStateName !== lInitialPseudoStateName
                    ) {
                        return pState.type !== "initial";
                    }
                    return true;
                }
            )
            .map(
                transformState(pTransitions || new StateMachineModel(pStateMachine).flattenedTransitions)
            )
    };

    if (lInitialStateName) {
        lRetval.initial = makeValidXMLName(lInitialStateName);
    }
    return lRetval;
}

module.exports = render;
