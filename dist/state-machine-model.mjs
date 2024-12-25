function flattenStatesToMap(pStates, pMap, pParent = "") {
	pStates
		.filter((pState) => Boolean(pState.statemachine))
		.forEach((pState) => {
			if (Object.hasOwn(pState.statemachine, "states")) {
				flattenStatesToMap(pState.statemachine.states, pMap, pState.name);
			}
		});
	pStates.forEach((pState) =>
		pMap.set(pState.name, {
			name: pState.name,
			type: pState.type,
			statemachine: Boolean(pState.statemachine),
			parent: pParent,
		}),
	);
}
function flattenTransitions(pStateMachine) {
	let lTransitions = [];
	if (Object.hasOwn(pStateMachine, "transitions")) {
		lTransitions = structuredClone(pStateMachine.transitions);
	}
	if (Object.hasOwn(pStateMachine, "states")) {
		pStateMachine.states
			.filter((pState) => Boolean(pState.statemachine))
			.forEach((pState) => {
				lTransitions = lTransitions.concat(
					flattenTransitions(pState.statemachine),
				);
			});
	}
	return lTransitions;
}
export default class StateMachineModel {
	_flattenedTransitions;
	_flattenedStates;
	constructor(pStateMachine) {
		this._flattenedStates = new Map();
		flattenStatesToMap(pStateMachine.states ?? [], this._flattenedStates);
		this._flattenedTransitions = flattenTransitions(pStateMachine);
	}
	get flattenedTransitions() {
		return this._flattenedTransitions;
	}
	findStateByName(pName) {
		return this._flattenedStates.get(pName);
	}
	findStatesByTypes(pTypes) {
		return Array.from(this._flattenedStates.values()).filter((pState) =>
			pTypes.includes(pState.type),
		);
	}
	findExternalSelfTransitions(pStateName) {
		return this._flattenedTransitions.filter(
			(pTransition) =>
				pTransition.from === pStateName &&
				pTransition.to === pStateName &&
				pTransition.type !== "internal",
		);
	}
	findTransitionsByFrom(pFromStateName) {
		return this._flattenedTransitions.filter(
			(pTransition) => pTransition.from === pFromStateName,
		);
	}
	findTransitionsByTo(pToStateName) {
		return this._flattenedTransitions.filter(
			(pTransition) => pTransition.to === pToStateName,
		);
	}
	getMaximumTransitionId() {
		return Math.max(...this._flattenedTransitions.map(({ id }) => id));
	}
	findTransitionsToSiblings(pStateName, pExcludeIds) {
		return this._flattenedTransitions.filter(
			(pTransition) =>
				!pExcludeIds.has(pTransition.id) &&
				pTransition.from === pStateName &&
				this._flattenedStates.get(pTransition.to)?.parent ===
					this._flattenedStates.get(pStateName)?.parent,
		);
	}
}
