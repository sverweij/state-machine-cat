function getStateIndex(pStates, pStateName) {
    return pStates.findIndex((pState) => pState.name === pStateName);
}

function getTransitionRow(pStates, pTransition) {
    // 0's; -1 at the from column, 1 at the to column
    const lRetval = Array(pStates.length).fill(0);
    lRetval[getStateIndex(pStates, pTransition.from)] = -1;
    lRetval[getStateIndex(pStates, pTransition.to)] = 1;
    return lRetval;
}

function isTransitionFromTo(pFromStateName, pToStateName){
    return function (pTransition){
        return pTransition.from === pFromStateName &&
                pTransition.to === pToStateName;
    };
}

function getCount(pTransitions) {
    return pTransitions.length;
}

function escapeify(pString) {
    return pString
        .replace(/\n( )*/g, '\n');
}

function getLabels(pTransitions) {
    return pTransitions
        .filter((pTransition) => pTransition.hasOwnProperty("label"))
        .map((pTransition) => pTransition.label)
        .map(escapeify);
}

function getTos(pAST, pTransitionSummaryFn) {
    return function(pFromState){
        return pAST.states.map((pToState) => pTransitionSummaryFn(
            pAST.hasOwnProperty("transitions")
                ? pAST.transitions.filter(
                    isTransitionFromTo(
                        pFromState.name,
                        pToState.name
                    )
                )
                : []
        ));
    };
}

module.exports = {
    /**
     * transforms the given AST in to a states x states table
     *
     * for this statemachine
     *   stateA => stateB;
     *   stateB => stateC;
     *   stateB => stateA;
     *   stateC => stateA: one way;
     *   stateC => stateA: another;
     * it would return
     *
     * [
     *    [0, 1, 0],
     *    [1, 0, 1],
     *    [2, 0, 0],
     * ]
     *
     * @param  {object} pAST abstract syntax tree of an smcat
     * @return {array} a 2 dimensional array of booleans
     */
    toAdjecencyMatrix (pAST) {
        return pAST.states.map(getTos(pAST, getCount));
    },

    /**
     * transforms the given AST in to a transition x state matrix
     *
     * for this statemachine
     *   stateA => stateB;
     *   stateB => stateC;
     *   stateB => stateA;
     *   stateC => stateA: one way;
     *   stateC => stateA: another;
     * it would return
     *
     * [
     *    [-1, 1, 0],
     *    [0, -1, 1],
     *    [1, -1, 0],
     *    [1, 0, -1],
     *    [1, 0, -1],
     * ]
     *
     * @param  {object} pAST abstract syntax tree of an smcat
     * @return {array} a 2 dimensional array of booleans
     */
    toIncidenceMatrix (pAST) {
        return pAST.hasOwnProperty("transitions")
            ? pAST.transitions.map(getTransitionRow.bind(null, pAST.states))
            : [];
    },

    /**
     * Same as toAdjecencyMatrix, but instead of a count returns an array
     * of the labels of the transitions
     * @param  {[type]} pAST [description]
     * @return {[type]}      [description]
     */
    renderLabels (pAST) {
        return pAST.states.map(getTos(pAST, getLabels));
    }
};
