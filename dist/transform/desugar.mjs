import StateMachineModel from "../state-machine-model.mjs";
import utl from "./utl.mjs";
function fuseTransitionAttribute(pIncomingThing, pOutgoingThing, pJoinChar) {
    return pIncomingThing
        ? `${pIncomingThing}${pJoinChar}${pOutgoingThing}`
        : pOutgoingThing;
}
function fuseIncomingToOutgoing(pIncomingTransition, pOutgoingTransition) {
    const lReturnValue = {
        ...pIncomingTransition,
        ...pOutgoingTransition,
        from: pIncomingTransition.from,
        to: pOutgoingTransition.to,
    };
    if (pOutgoingTransition.action) {
        lReturnValue.action = fuseTransitionAttribute(pIncomingTransition.action, pOutgoingTransition.action, "\n");
    }
    if (lReturnValue.event || lReturnValue.cond || lReturnValue.action) {
        lReturnValue.label = utl.formatLabel(lReturnValue.event, lReturnValue.cond, lReturnValue.action);
    }
    return lReturnValue;
}
function fuseTransitions(pTransitions, pPseudoStateNames, pOutgoingTransitionMap) {
    return pTransitions.reduce((pAll, pTransition) => {
        pPseudoStateNames.forEach((pStateName, pIndex) => {
            if (pStateName === pTransition.to &&
                pOutgoingTransitionMap[pStateName]) {
                pAll = pAll.concat(pOutgoingTransitionMap[pStateName].map((pOutgoingTransition) => fuseIncomingToOutgoing(pTransition, pOutgoingTransition)));
            }
            else {
                pAll = pIndex === 0 ? pAll.concat(pTransition) : pAll;
            }
        });
        return pAll;
    }, []);
}
function deSugarPseudoStates(pMachine, pPseudoStateNames, pOutgoingTransitionMap) {
    const lMachine = structuredClone(pMachine);
    if (lMachine.transitions && pPseudoStateNames.length > 0) {
        lMachine.transitions = fuseTransitions(lMachine.transitions, pPseudoStateNames, pOutgoingTransitionMap);
    }
    lMachine.states = lMachine.states.map((pState) => pState.statemachine
        ? {
            ...pState,
            statemachine: deSugarPseudoStates(pState.statemachine, pPseudoStateNames, pOutgoingTransitionMap),
        }
        : pState);
    return lMachine;
}
function removeStatesCascading(pMachine, pStateNames) {
    const lMachine = structuredClone(pMachine);
    if (lMachine.transitions) {
        lMachine.transitions = lMachine.transitions.filter((pTransition) => !pStateNames.some((pJunctionStateName) => pJunctionStateName === pTransition.from ||
            pJunctionStateName === pTransition.to));
    }
    lMachine.states = lMachine.states
        .filter((pState) => !pStateNames.includes(pState.name))
        .map((pState) => pState.statemachine
        ? {
            ...pState,
            statemachine: removeStatesCascading(pState.statemachine, pStateNames),
        }
        : pState);
    return lMachine;
}
export default (pMachine, pDesugarableStates = ["fork", "junction", "choice"]) => {
    const lModel = new StateMachineModel(pMachine);
    const lPseudoStateNames = lModel
        .findStatesByTypes(pDesugarableStates)
        .map(({ name }) => name);
    const lOutgoingTransitionMap = lPseudoStateNames.reduce((pAll, pStateName) => {
        pAll[pStateName] = lModel.findTransitionsByFrom(pStateName);
        return pAll;
    }, {});
    const lMachine = deSugarPseudoStates(pMachine, lPseudoStateNames, lOutgoingTransitionMap);
    return removeStatesCascading(lMachine, lPseudoStateNames);
};
