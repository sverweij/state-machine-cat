function flattenStates(pStates) {
    let lRetval = [];
    pStates
        .filter((pState) => Boolean(pState.statemachine))
        .forEach((pState) => {
            if (pState.statemachine.hasOwnProperty("states")) {
                lRetval =
                    lRetval.concat(
                        flattenStates(pState.statemachine.states)
                    );
            }
        });

    return lRetval.concat(
        pStates.map(
            (pState) => ({
                name: pState.name,
                type: pState.type,
                statemachine: Boolean(pState.statemachine)
            })
        )
    );
}

function flattenTransitions(pStateMachine) {
    let lTransitions = [];

    if (pStateMachine.hasOwnProperty("transitions")) {
        lTransitions = pStateMachine.transitions;
    }
    if (pStateMachine.hasOwnProperty("states")) {
        pStateMachine.states
            .filter((pState) => Boolean(pState.statemachine))
            .forEach((pState) => {
                lTransitions = lTransitions.concat(
                    flattenTransitions(pState.statemachine)
                );
            });
    }
    return lTransitions;
}

class StateMachineModel {

    constructor(pAST){
        this._flattenedStates = flattenStates(pAST.states || []);
        this._flattenedTransitions = flattenTransitions(pAST);
    }

    get flattenedTransitions(){
        return this._flattenedTransitions;
    }

    findStateByName(pName){
        return this._flattenedStates.find((pState) => pState.name === pName);
    }

    stateHasSelfTransitions(pStateName) {
        return this._flattenedTransitions.some(
            (pTransition) => pTransition.from === pStateName && pTransition.to === pStateName
        );
    }

    findTransitionsByFrom(pFromStateName) {
        return this._flattenedTransitions.filter(
            (pTransition) => pTransition.from === pFromStateName
        );
    }

    findTransitionsByTo(pToStateName) {
        return this._flattenedTransitions.filter(
            (pTransition) => pTransition.to === pToStateName
        );
    }


}

module.exports = StateMachineModel;
