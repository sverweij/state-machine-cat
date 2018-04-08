function stateExists (pKnownStateNames, pName) {
    return pKnownStateNames.some((pKnownStateName) => pKnownStateName === pName);
}

function initState(pName) {
    return {
        name: pName,
        type: getStateType(pName)
    };
}

/* eslint complexity:0*/
function getStateType(pName) {
    const INITIAL_RE  = /initial/;
    const FINAL_RE    = /final/;
    const PARALLEL_RE = /parallel/;
    const HISTORY_RE  = /history/;
    const DEEP_RE     = /deep/;
    const CHOICE_RE   = /^\^.*/;
    const FORKJOIN_RE = /^].*/;

    if (INITIAL_RE.test(pName)){
        return "initial";
    }
    if (FINAL_RE.test(pName)){
        return "final";
    }
    if (PARALLEL_RE.test(pName)){
        return "parallel";
    }
    if (HISTORY_RE.test(pName)){
        if (DEEP_RE.test(pName)) {
            return "deephistory";
        }
        return "history";
    }
    if (CHOICE_RE.test(pName)){
        return "choice";
    }
    if (FORKJOIN_RE.test(pName)){
        return "forkjoin";
    }
    return "regular";
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

function joinNotes(pNotes, pThing) {
    if (pNotes && pNotes.length > 0) {
        pThing.note = pNotes;
    }
    return pThing;
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
    const lMatchResult = pString.match(TRANSITION_EXPRESSION_RE);

    if (lMatchResult){
        if (lMatchResult[1]){
            lRetval.event = lMatchResult[1].trim();
        }
        if (lMatchResult[2]){
            lRetval.cond = lMatchResult[2].substr(1, lMatchResult[2].length - 2).trim();
        }
        if (lMatchResult[3]){
            lRetval.action = lMatchResult[3].substr(1, lMatchResult[3].length - 1).trim();
        }
    }

    return lRetval;
}

function parseStateActivities(pString) {
    const lRetval = {};
    const TRIGGER_RE_AS_A_STRING = "\\s*(entry|exit)\\s*/\\s*([^\\n$]*)(\\n|$)";
    /* eslint security/detect-non-literal-regexp:0 */
    const TRIGGERS_RE = new RegExp(TRIGGER_RE_AS_A_STRING, "g");
    const TRIGGER_RE  = new RegExp(TRIGGER_RE_AS_A_STRING);

    const lTriggers = pString.match(TRIGGERS_RE);

    if (lTriggers) {
        lRetval.triggers = lTriggers.map(
            (pEntry) => {
                const lMatch = pEntry.match(TRIGGER_RE);
                return {
                    "type": lMatch[1],
                    "body": lMatch[2]
                };
            }
        );
    }

    return lRetval;
}

module.exports = {
    initState,
    extractUndeclaredStates,
    joinNotes,
    stateEqual,
    uniq,
    parseTransitionExpression,
    parseStateActivities
};

/*
 This file is part of state-machine-cat.

 smcat is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 smcat is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with smcat.  If not, see <http://www.gnu.org/licenses/>.
 */
