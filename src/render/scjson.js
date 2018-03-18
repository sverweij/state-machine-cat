const STATE_TYPE2SCXML_STATE_TYPE = {
    initial: "initial",
    regular: "state",
    history: "history",
    final: "final"
};

function stateType2SCXMLStateType (pStateType) {
    return STATE_TYPE2SCXML_STATE_TYPE[pStateType] || "state";
}

function transformTransition(pTransition){
    const lRetval = {
        target: pTransition.to
    };

    if (Boolean(pTransition.event)){
        lRetval.event = pTransition.event;
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

function pullOutTriggerType(pRetval, pTriggersType, pTriggers, pTriggerType) {
    const lTriggerArray = extractTriggers(pTriggers, pTriggerType);

    if (lTriggerArray.length > 0){
        pRetval[pTriggersType] = (pRetval[pTriggersType] || []).concat(lTriggerArray);
    }
}

function transformTriggers(pRetval, pState) {
    if (Boolean(pState.activities)) {
        if (Boolean(pState.triggers)) {
            pullOutTriggerType(pRetval, "onentries", pState.triggers, "onentry");
            pullOutTriggerType(pRetval, "onexits", pState.triggers, "onexit");
        } else {
            pRetval.onentries = [pState.activities];
        }
    }

}

function transformState(pTransitions) {
    return function (pState){
        const lRetval = {
            type: stateType2SCXMLStateType(pState.type),
            id: pState.name
        };

        transformTriggers(lRetval, pState);

        if (Boolean(pTransitions)){
            lRetval.transitions =
                pTransitions
                    .filter((pTransition) => pTransition.from === pState.name)
                    .map(transformTransition);
        }

        if (Boolean(pState.statemachine)) {
            const lRenderedState = render(pState.statemachine);

            lRetval.states = (lRetval.states || []).concat(lRenderedState.states);
            if (lRenderedState.initial) {
                lRetval.initial = lRenderedState.initial;
            }

        }
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

function render(pStateMachine) {
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
                transformState(pStateMachine.transitions)
            )
    };

    if (lInitialStateName) {
        lRetval.initial = lInitialStateName;
    }
    return lRetval;
}

module.exports = render;

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
