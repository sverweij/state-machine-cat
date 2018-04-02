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

    // findTransitionsByFromName(pFromName){
    //     return this._flattenedTransitions.filter((pTransition) => pTransition.from === pFromName);
    // }
}

module.exports = StateMachineModel;
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
