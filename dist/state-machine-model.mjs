function flattenStatesToMap(pStates, pMap, pParent = "") {
	for (const lState of pStates) {
		if (lState?.statemachine?.states) {
			flattenStatesToMap(lState.statemachine.states, pMap, lState.name);
		}
	}
	for (const lState of pStates) {
		pMap.set(lState.name, {
			name: lState.name,
			type: lState.type,
			statemachine: Boolean(lState.statemachine),
			parent: pParent,
		});
	}
}
function flattenTransitions(pStateMachine) {
	let lTransitions = [];
	if (Object.hasOwn(pStateMachine, "transitions")) {
		lTransitions = structuredClone(pStateMachine.transitions);
	}
	if (Object.hasOwn(pStateMachine, "states")) {
		for (const lState of pStateMachine.states) {
			if (lState.statemachine) {
				lTransitions = lTransitions.concat(
					flattenTransitions(lState.statemachine),
				);
			}
		}
	}
	return lTransitions;
}
export default class StateMachineModel {
	#flattenedTransitions;
	#flattenedStates;
	constructor(pStateMachine) {
		this.#flattenedStates = new Map();
		flattenStatesToMap(pStateMachine.states ?? [], this.#flattenedStates);
		this.#flattenedTransitions = flattenTransitions(pStateMachine);
	}
	get flattenedTransitions() {
		return this.#flattenedTransitions;
	}
	get flattenedStates() {
		return this.#flattenedStates;
	}
	findStateByName(pName) {
		return this.#flattenedStates.get(pName);
	}
	findStatesByTypes(pTypes) {
		return Array.from(this.#flattenedStates.values()).filter((pState) =>
			pTypes.includes(pState.type),
		);
	}
	findExternalSelfTransitions(pStateName) {
		return this.#flattenedTransitions.filter(
			(pTransition) =>
				pTransition.from === pStateName &&
				pTransition.to === pStateName &&
				pTransition.type !== "internal",
		);
	}
	findTransitionsByFrom(pFromStateName) {
		return this.#flattenedTransitions.filter(
			(pTransition) => pTransition.from === pFromStateName,
		);
	}
	findTransitionsByTo(pToStateName) {
		return this.#flattenedTransitions.filter(
			(pTransition) => pTransition.to === pToStateName,
		);
	}
	getMaximumTransitionId() {
		return Math.max(...this.#flattenedTransitions.map(({ id }) => id));
	}
	findTransitionsToSiblings(pStateName, pExcludeIds) {
		return this.#flattenedTransitions.filter(
			(pTransition) =>
				!pExcludeIds.has(pTransition.id) &&
				pTransition.from === pStateName &&
				this.#flattenedStates.get(pTransition.to)?.parent ===
					this.#flattenedStates.get(pStateName)?.parent,
		);
	}
}
