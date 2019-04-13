const StateMachineModel = require('../stateMachineModel');

const TRIGGER_RE_AS_A_STRING = "^(entry|activity|exit)\\s*/\\s*([^\\n$]*)(\\n|$)";
/* eslint security/detect-non-literal-regexp:0 */
const TRIGGER_RE             = new RegExp(TRIGGER_RE_AS_A_STRING);

function stateExists (pKnownStateNames, pName) {
    return pKnownStateNames.some((pKnownStateName) => pKnownStateName === pName);
}

function initState(pName) {
    return {
        name: pName,
        type: getStateType(pName)
    };
}

const RE2STATE_TYPE = [{
    re: /initial/,
    stateType: "initial"
}, {
    re: /final/,
    stateType: "final"
}, {
    re: /parallel/,
    stateType: "parallel"
}, {
    re: /(deep.*history)|(history.*deep)/,
    stateType: "deephistory"
}, {
    re: /history/,
    stateType: "history"
}, {
    re: /^\^.*/,
    stateType: "choice"
}, {
    re: /^].*/,
    stateType: "forkjoin"
}];

function matches(pName){
    return (pEntry) => pEntry.re.test(pName);
}

function getStateType(pName) {
    return (RE2STATE_TYPE.find(matches(pName)) || {stateType:"regular"}).stateType;
}

function extractUndeclaredStates (pStateMachine, pKnownStateNames) {
    pKnownStateNames = pKnownStateNames
        ? pKnownStateNames
        : getAlreadyDeclaredStates(pStateMachine);

    pStateMachine.states = pStateMachine.states || [];
    const lTransitions = pStateMachine.transitions || [];

    pStateMachine
        .states
        .filter(isComposite)
        .forEach((pState) => {
            pState.statemachine.states =
                extractUndeclaredStates(
                    pState.statemachine,
                    pKnownStateNames
                );
        });

    lTransitions.forEach((pTransition) => {
        if (!stateExists(pKnownStateNames, pTransition.from)) {
            pKnownStateNames.push(pTransition.from);
            pStateMachine.states.push(initState(pTransition.from));
        }
        if (!stateExists(pKnownStateNames, pTransition.to)) {
            pKnownStateNames.push(pTransition.to);
            pStateMachine.states.push(initState(pTransition.to));
        }
    });
    return pStateMachine.states;
}

function classifyForkJoin(pInComingCount, pOutGoingCount) {
    let lRetval = "junction";

    if (pInComingCount <= 1 && pOutGoingCount > 1) {
        lRetval = "fork";
    }
    if (pInComingCount > 1 && pOutGoingCount <= 1) {
        lRetval = "join";
    }

    return lRetval;
}

function classifyForkJoins(pStateMachine, pFlattenedStateMachineModel = new StateMachineModel(pStateMachine)) {

    pStateMachine.states =
        pStateMachine.states
            .map(
                (pState) => {
                    if (pState.type === 'forkjoin' && !pState.typeExplicitlySet) {
                        const lInComingCount = pFlattenedStateMachineModel.findTransitionsByTo(pState.name).length;
                        const lOutGoingCount = pFlattenedStateMachineModel.findTransitionsByFrom(pState.name).length;
                        pState.type = classifyForkJoin(lInComingCount, lOutGoingCount);
                    }
                    if (pState.statemachine) {
                        pState.statemachine = classifyForkJoins(pState.statemachine, pFlattenedStateMachineModel);
                    }
                    return pState;
                }
            );

    return pStateMachine;
}


function stateEqual(pStateOne, pStateTwo) {
    return pStateOne.name === pStateTwo.name;
}

function uniq(pArray, pEqualFn) {
    return pArray
        .reduce(
            (pBag, pMarble) => {
                const lMarbleIndex = pBag.findIndex((pBagItem) => pEqualFn(pBagItem, pMarble));

                if (lMarbleIndex > -1) {
                    pBag[lMarbleIndex] = pMarble; // ensures the _last_ marble we find is in the bag on that position
                    return pBag;
                }
                return pBag.concat(pMarble);

            },
            []
        );
}

function isComposite(pState){
    return Boolean(pState.statemachine);
}

function getAlreadyDeclaredStates(pStateMachine) {
    const lStates = pStateMachine.states || [];

    return lStates
        .filter(isComposite)
        .reduce(
            (pAllStateNames, pThisState) => pAllStateNames.concat(
                getAlreadyDeclaredStates(pThisState.statemachine)
            ),
            lStates.map((pState) => pState.name)
        );
}

function parseTransitionExpression(pString) {
    /* eslint security/detect-unsafe-regex:0 */
    const TRANSITION_EXPRESSION_RE = /([^[/]+)?(\[[^\]]+\])?[^/]*(\/.+)?/;
    const lRetval = {};

    // match has no fallback because TRANSITION_EXPRESSION_RE will match
    // any string (every part is optional)
    const lMatchResult = pString.match(TRANSITION_EXPRESSION_RE);

    if (lMatchResult[1]){
        lRetval.event = lMatchResult[1].trim();
    }
    if (lMatchResult[2]){
        lRetval.cond = lMatchResult[2].substr(1, lMatchResult[2].length - 2).trim();
    }
    if (lMatchResult[3]){
        lRetval.action = lMatchResult[3].substr(1, lMatchResult[3].length - 1).trim();
    }

    return lRetval;
}

function setIf(pObject, pProperty, pValue, pCondition = (x) => x) {
    if (pCondition(pValue)){
        pObject[pProperty] = pValue;
    }
}

function setIfNotEmpty(pObject, pProperty, pValue) {
    setIf(pObject, pProperty, pValue, (x) => x && x.length > 0);
}

function extractAction(pActivityCandidate) {
    const lMatch = pActivityCandidate.match(TRIGGER_RE);
    if (lMatch) {
        return {
            "type": lMatch[1],
            "body": lMatch[2]
        };
    }
    return {
        "type": "activity",
        "body": pActivityCandidate
    };
}

function extractActions(pString) {
    return pString
        .split(/\n\s*/g)
        .map((pActivityCandidate) => pActivityCandidate.trim())
        .map(extractAction);
}

module.exports = {
    initState,
    extractUndeclaredStates,
    classifyForkJoins,
    stateEqual,
    uniq,
    parseTransitionExpression,
    extractActions,
    setIf,
    setIfNotEmpty
};
