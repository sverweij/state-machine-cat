import StateMachineModel from "../state-machine-model.mjs";
function stateExists(pKnownStateNames, pName) {
	return pKnownStateNames.includes(pName);
}
const RE2STATE_TYPE = [
	{
		re: /initial/,
		stateType: "initial",
	},
	{
		re: /final/,
		stateType: "final",
	},
	{
		re: /parallel/,
		stateType: "parallel",
	},
	{
		re: /(deep.*history)|(history.*deep)/,
		stateType: "deephistory",
	},
	{
		re: /history/,
		stateType: "history",
	},
	{
		re: /^\^.*/,
		stateType: "choice",
	},
	{
		re: /^].*/,
		stateType: "forkjoin",
	},
];
function matches(pName) {
	return (pEntry) => pEntry.re.test(pName);
}
export function getStateType(pName) {
	return (RE2STATE_TYPE.find(matches(pName)) || { stateType: "regular" })
		.stateType;
}
export function initState(pName) {
	return {
		name: pName,
		type: getStateType(pName),
	};
}
function isComposite(pState) {
	return Boolean(pState.statemachine);
}
function getAlreadyDeclaredStates(pStateMachine) {
	const lStates = pStateMachine?.states ?? [];
	return lStates.filter(isComposite).reduce(
		(pAllStateNames, pThisState) =>
			pAllStateNames.concat(getAlreadyDeclaredStates(pThisState.statemachine)),
		lStates.map(({ name }) => name),
	);
}
export function extractUndeclaredStates(pStateMachine, pKnownStateNames) {
	pKnownStateNames =
		pKnownStateNames ?? getAlreadyDeclaredStates(pStateMachine);
	pStateMachine.states = pStateMachine?.states ?? [];
	const lTransitions = pStateMachine?.transitions ?? [];
	for (const lState of pStateMachine.states.filter(isComposite)) {
		lState.statemachine.states = extractUndeclaredStates(
			lState.statemachine,
			pKnownStateNames,
		);
	}
	for (const lTransition of lTransitions) {
		if (!stateExists(pKnownStateNames, lTransition.from)) {
			pKnownStateNames.push(lTransition.from);
			pStateMachine.states.push(initState(lTransition.from));
		}
		if (!stateExists(pKnownStateNames, lTransition.to)) {
			pKnownStateNames.push(lTransition.to);
			pStateMachine.states.push(initState(lTransition.to));
		}
	}
	return pStateMachine.states;
}
function classifyForkJoin(pInComingCount, pOutGoingCount) {
	let lReturnValue = "junction";
	if (pInComingCount <= 1 && pOutGoingCount > 1) {
		lReturnValue = "fork";
	}
	if (pInComingCount > 1 && pOutGoingCount <= 1) {
		lReturnValue = "join";
	}
	return lReturnValue;
}
export function classifyForkJoins(
	pStateMachine,
	pFlattenedStateMachineModel = new StateMachineModel(pStateMachine),
) {
	pStateMachine.states = pStateMachine.states.map((pState) => {
		if (pState.type === "forkjoin" && !pState.typeExplicitlySet) {
			const lInComingCount = pFlattenedStateMachineModel.findTransitionsByTo(
				pState.name,
			).length;
			const lOutGoingCount = pFlattenedStateMachineModel.findTransitionsByFrom(
				pState.name,
			).length;
			pState.type = classifyForkJoin(lInComingCount, lOutGoingCount);
		}
		if (pState.statemachine) {
			pState.statemachine = classifyForkJoins(
				pState.statemachine,
				pFlattenedStateMachineModel,
			);
		}
		return pState;
	});
	return pStateMachine;
}
export function stateEqual(pStateOne, pStateTwo) {
	return pStateOne.name === pStateTwo.name;
}
export function uniq(pArray, pEqualFunction) {
	return pArray.reduce((pBag, pMarble) => {
		const lMarbleIndex = pBag.findIndex((pBagItem) =>
			pEqualFunction(pBagItem, pMarble),
		);
		if (lMarbleIndex > -1) {
			pBag[lMarbleIndex] = pMarble;
			return pBag;
		}
		return pBag.concat(pMarble);
	}, []);
}
const TRANSITION_EXPRESSION_RE =
	/(?<event>[^[/]{1,256})?(?<condition>\[[^\]]{1,256}\])?[^/]{0,100}(?<action>\/.{1,2048})?/;
export function parseTransitionExpression(pString) {
	const lReturnValue = {};
	const lMatch = TRANSITION_EXPRESSION_RE.exec(pString);
	if (lMatch?.groups) {
		if (lMatch.groups.event) {
			lReturnValue.event = lMatch.groups.event.trim();
		}
		if (lMatch.groups.condition) {
			lReturnValue.cond = lMatch.groups.condition.slice(1, -1).trim();
		}
		if (lMatch.groups.action) {
			lReturnValue.action = lMatch.groups.action
				.slice(1, lMatch.groups.action.length)
				.trim();
		}
	}
	return lReturnValue;
}
export function setIf(pObject, pProperty, pValue, pCondition = Boolean) {
	if (pCondition(pValue)) {
		pObject[pProperty] = pValue;
	}
}
export function setIfNotEmpty(pObject, pProperty, pValue) {
	setIf(pObject, pProperty, pValue, (pX) => pX && pX.length > 0);
}
const TRIGGER_RE =
	/^(?<triggerType>entry|activity|exit)\s{0,100}\/\s{0,100}(?<triggerBody>[^\n$]{0,2048})(?:\n|$)/;
function extractAction(pActivityCandidate) {
	const lReturnValue = { type: "activity", body: pActivityCandidate };
	const lMatch = TRIGGER_RE.exec(pActivityCandidate);
	if (lMatch?.groups) {
		lReturnValue.type = lMatch.groups.triggerType;
		lReturnValue.body = lMatch.groups.triggerBody;
	}
	return lReturnValue;
}
export function extractActions(pString) {
	return pString
		.split(/\n\s*/g)
		.map((pActivityCandidate) => pActivityCandidate.trim())
		.map(extractAction);
}
