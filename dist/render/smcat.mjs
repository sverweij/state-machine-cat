const NAME_QUOTABLE = /;|,|{| |\[/;
const ACTIONS_QUOTABLE = /;|,|{/;
const LABEL_QUOTABLE = /;|{/;
const RENDERABLE_STATE_ATTRIBUTES = [
	"label",
	"type",
	"color",
	"active",
	"class",
];
const RENDERABLE_TRANSITION_ATTRIBUTES = ["type", "color", "class"];
function quoteIfNecessary(pRegExp, pString) {
	return pRegExp.test(pString) ? `"${pString}"` : pString;
}
function stateHasExtendedAttributes(pState) {
	return (
		Object.hasOwn(pState, "label") ||
		Object.hasOwn(pState, "typeExplicitlySet") ||
		Object.hasOwn(pState, "color") ||
		Object.hasOwn(pState, "active") ||
		Object.hasOwn(pState, "class")
	);
}
function note(pNote, pIndent = "") {
	return pNote.map((pNoteLine) => `${pIndent}# ${pNoteLine}`).join("\n");
}
function extendedAttribute(pKey, pValue) {
	if (pKey === "type") {
		return `${pKey}=${pValue}`;
	}
	if (pKey === "active") {
		return pValue ? pKey : "";
	}
	return `${pKey}="${pValue}"`;
}
function extendedStateAttributes(pState) {
	return Object.entries(pState)
		.filter(([pKey]) => RENDERABLE_STATE_ATTRIBUTES.includes(pKey))
		.filter(([pKey]) => pKey !== "type" || pState.typeExplicitlySet)
		.map(([pKey, pValue]) => extendedAttribute(pKey, pValue))
		.join(" ");
}
function actions(pActions) {
	return pActions
		.map(
			(pAction) =>
				`${pAction.type === "activity" ? "" : `${pAction.type}/ `}${pAction.body}`,
		)
		.map((pAction) => quoteIfNecessary(ACTIONS_QUOTABLE, pAction))
		.join("\n    ");
}
function state(pState, pIndent = "") {
	let lReturnValue = pIndent + quoteIfNecessary(NAME_QUOTABLE, pState.name);
	if (pState.note) {
		lReturnValue = `${note(pState.note, pIndent)}\n${lReturnValue}`;
	}
	if (stateHasExtendedAttributes(pState)) {
		lReturnValue += ` [${extendedStateAttributes(pState)}]`;
	}
	if (pState.actions) {
		lReturnValue += `: ${actions(pState.actions)}`;
	}
	if (pState.statemachine) {
		lReturnValue += " {\n";
		lReturnValue += renderSmcat(pState.statemachine, null, `${pIndent}    `);
		lReturnValue += `${pIndent}}`;
	}
	return lReturnValue;
}
function states(pStates, pIndent = "") {
	return pStates
		.map((pState) => state(pState, pIndent))
		.join(",\n")
		.concat(pStates.length > 0 ? ";\n\n" : "");
}
function transitionHasExtendedAttributes(pTransition) {
	return Object.entries(pTransition).some(([pKey]) =>
		RENDERABLE_TRANSITION_ATTRIBUTES.includes(pKey),
	);
}
function extendedTransitionAttributes(pTransition) {
	return Object.entries(pTransition)
		.filter(([pKey]) => RENDERABLE_TRANSITION_ATTRIBUTES.includes(pKey))
		.map(([pKey, pValue]) => extendedAttribute(pKey, pValue))
		.join(" ");
}
function transition(pTransition, pIndent = "") {
	let lReturnValue = `${pIndent}${quoteIfNecessary(NAME_QUOTABLE, pTransition.from)} => ${quoteIfNecessary(NAME_QUOTABLE, pTransition.to)}`;
	if (pTransition.note) {
		lReturnValue = `${note(pTransition.note, pIndent)}\n${lReturnValue}`;
	}
	if (transitionHasExtendedAttributes(pTransition)) {
		lReturnValue += ` [${extendedTransitionAttributes(pTransition)}]`;
	}
	if (pTransition.label) {
		lReturnValue += `: ${quoteIfNecessary(LABEL_QUOTABLE, pTransition.label)}`;
	}
	return lReturnValue;
}
function transitions(pTransitions, pIndent = "") {
	return pTransitions
		.map((pTransition) => transition(pTransition, pIndent))
		.join(";\n")
		.concat(pTransitions.length > 0 ? ";\n" : "");
}
export default function renderSmcat(
	pStateMachine,
	_pOptions = {},
	pIndent = "",
) {
	return (
		states(pStateMachine.states, pIndent) +
		transitions(pStateMachine.transitions || [], pIndent)
	);
}
