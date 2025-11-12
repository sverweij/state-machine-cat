import StateMachineModel from "../state-machine-model.mjs";
import { Counter } from "../counter.mjs";
import utl from "./utl.mjs";
function fuseTransitionAttribute(pIncomingThing, pOutgoingThing, pJoinChar) {
	return pIncomingThing
		? `${pIncomingThing}${pJoinChar}${pOutgoingThing}`
		: pOutgoingThing;
}
function fuseIncomingToOutgoing(
	pIncomingTransition,
	pOutgoingTransition,
	pCounter,
) {
	const lReturnValue = {
		...pIncomingTransition,
		...pOutgoingTransition,
		from: pIncomingTransition.from,
		to: pOutgoingTransition.to,
		id: pCounter.next(),
	};
	if (pOutgoingTransition.action) {
		lReturnValue.action = fuseTransitionAttribute(
			pIncomingTransition.action,
			pOutgoingTransition.action,
			"\n",
		);
	}
	if (lReturnValue.event || lReturnValue.cond || lReturnValue.action) {
		lReturnValue.label = utl.formatLabel(
			lReturnValue.event,
			lReturnValue.cond,
			lReturnValue.action,
		);
	}
	return lReturnValue;
}
function fuseTransitions(
	pTransitions,
	pPseudoStateNames,
	pOutgoingTransitionMap,
	pCounter,
) {
	const lResult = [];
	for (const lTransition of pTransitions) {
		let lAdded = false;
		for (const lStateName of pPseudoStateNames) {
			if (lStateName === lTransition.to && pOutgoingTransitionMap[lStateName]) {
				for (const lOutgoing of pOutgoingTransitionMap[lStateName]) {
					lResult.push(
						fuseIncomingToOutgoing(lTransition, lOutgoing, pCounter),
					);
				}
				lAdded = true;
			}
		}
		if (!lAdded) {
			lResult.push(lTransition);
		}
	}
	return lResult;
}
function deSugarPseudoStates(
	pMachine,
	pPseudoStateNames,
	pOutgoingTransitionMap,
	pCounter,
) {
	const lMachine = structuredClone(pMachine);
	if (lMachine.transitions && pPseudoStateNames.length > 0) {
		lMachine.transitions = fuseTransitions(
			lMachine.transitions,
			pPseudoStateNames,
			pOutgoingTransitionMap,
			pCounter,
		);
	}
	lMachine.states = lMachine.states.map((pState) =>
		pState.statemachine
			? {
					...pState,
					statemachine: deSugarPseudoStates(
						pState.statemachine,
						pPseudoStateNames,
						pOutgoingTransitionMap,
						pCounter,
					),
				}
			: pState,
	);
	return lMachine;
}
function removeStatesCascading(pMachine, pStateNames) {
	const lMachine = structuredClone(pMachine);
	if (lMachine.transitions) {
		lMachine.transitions = lMachine.transitions.filter(
			(pTransition) =>
				!pStateNames.some(
					(pJunctionStateName) =>
						pJunctionStateName === pTransition.from ||
						pJunctionStateName === pTransition.to,
				),
		);
	}
	lMachine.states = lMachine.states
		.filter((pState) => !pStateNames.includes(pState.name))
		.map((pState) =>
			pState.statemachine
				? {
						...pState,
						statemachine: removeStatesCascading(
							pState.statemachine,
							pStateNames,
						),
					}
				: pState,
		);
	return lMachine;
}
export default (
	pMachine,
	pDesugarableStates = ["fork", "junction", "choice"],
) => {
	const lModel = new StateMachineModel(pMachine);
	const lPseudoStateNames = lModel
		.findStatesByTypes(pDesugarableStates)
		.map(({ name }) => name);
	const lOutgoingTransitionMap = lPseudoStateNames.reduce(
		(pAll, pStateName) => {
			pAll[pStateName] = lModel.findTransitionsByFrom(pStateName);
			return pAll;
		},
		{},
	);
	const lMaximumTransitionId = lModel.getMaximumTransitionId();
	const lMachine = deSugarPseudoStates(
		pMachine,
		lPseudoStateNames,
		lOutgoingTransitionMap,
		new Counter(lMaximumTransitionId),
	);
	return removeStatesCascading(lMachine, lPseudoStateNames);
};
