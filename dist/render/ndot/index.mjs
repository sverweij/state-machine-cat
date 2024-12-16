import he from "he";
import { getOptionValue } from "../../options.mjs";
import {
	buildGraphAttributes,
	buildNodeAttributes,
	buildEdgeAttributes,
} from "./attributebuilder.mjs";
import { escapeLabelString, isVertical } from "./utl.mjs";
function template(pOptions, pMachine) {
	const lTemplate = `digraph "state transitions" {
  {{graphAttributes}}
  node [{{nodeAttributes}}]
  edge [{{edgeAttributes}}]

{{machine}}
}
`;
	return lTemplate
		.replace(
			"{{graphAttributes}}",
			buildGraphAttributes(
				getOptionValue(pOptions, "engine"),
				getOptionValue(pOptions, "direction"),
				pOptions?.dotGraphAttrs || [],
			),
		)
		.replace(
			"{{nodeAttributes}}",
			buildNodeAttributes(pOptions.dotNodeAttrs || []),
		)
		.replace(
			"{{edgeAttributes}}",
			buildEdgeAttributes(pOptions.dotNodeAttrs || []),
		)
		.replace("{{machine}}", pMachine);
}
function formatActionType(pString) {
	return pString === "activity" ? "" : `${pString}/ `;
}
function regularStateActions(pActions, pIndent) {
	return pActions
		.map((pAction) =>
			he.escape(`${formatActionType(pAction.type)}${pAction.body}`),
		)
		.map((pActionString, pIndex) => {
			let lReturnValue = `<tr><td align="left" cellpadding="2">${pActionString}</td></tr>`;
			if (pIndex === 0) {
				lReturnValue = `<hr/>${lReturnValue}`;
			}
			return `\n${pIndent}        ${lReturnValue}`;
		})
		.join("");
}
function regular(pState, pIndent) {
	const lClass = pState.class
		? `state regular ${pState.class}"`
		: "state regular";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	const lCellPadding = (pState.actions?.length ?? 0) > 0 ? 2 : 7;
	const lActions = regularStateActions(pState?.actions ?? [], pIndent);
	const lBareLabel = he.escape(pState.label || pState.name);
	const lLabel = pState.active ? `<i>${lBareLabel}</i>` : lBareLabel;
	const lLabelTag = `
${pIndent}    <table align="center" cellborder="0" border="2" style="rounded" width="48">
${pIndent}      <tr><td width="48" cellpadding="${lCellPadding}">${lLabel}</td></tr>${lActions}
${pIndent}    </table>`;
	return `${pIndent}  "${pState.name}" [margin=0 class="${lClass}" color="${lColor}"${lActiveAttribute} label= <${lLabelTag}
${pIndent}  >]`;
}
function initial(pState, pIndent) {
	const lClass = pState.class
		? `state initial ${pState.class}"`
		: "state initial";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
	return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}" fixedsize=true height=0.15 label=""${lActiveAttribute}]`;
}
function history(pState, pIndent) {
	const lClass = pState.class
		? `state history ${pState.class}"`
		: "state history";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	return `${pIndent}  "${pState.name}" [shape=circle class="${lClass}" color="${lColor}" label="H"${lActiveAttribute}]`;
}
function deepHistory(pState, pIndent) {
	const lClass = pState.class
		? `state history ${pState.class}"`
		: "state history";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	return `${pIndent}  "${pState.name}" [shape=circle class="${lClass}" color="${lColor}" label="H*"${lActiveAttribute}]`;
}
function choiceActions(pActions, pActive) {
	return pActions
		.map((pAction) => {
			let lReturnValue = he.escape(
				`${formatActionType(pAction.type)}${pAction.body}`,
			);
			if (pActive) {
				lReturnValue = `<i>${lReturnValue}</i>`;
			}
			return lReturnValue;
		})
		.join("\\n");
}
function choice(pState, pIndent) {
	const lClass = pState.class
		? `state choice ${pState.class}"`
		: "state choice";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? "penwidth=3.0 " : "";
	const lActions = choiceActions(
		pState?.actions ?? [],
		pState?.active ?? false,
	);
	const lLabelTag = lActions;
	const lDiamond = `${pIndent}  "${pState.name}" [shape=diamond fixedsize=true width=0.35 height=0.35 fontsize=10 label=" " class="${lClass}" color="${lColor}"${lActiveAttribute}]`;
	const lLabelConstruct = `${pIndent}  "${pState.name}" -> "${pState.name}" [color="#FFFFFF01" fontcolor="${lColor}" class="${lClass}" label=<${lLabelTag}>]`;
	return `${lDiamond}\n${lLabelConstruct}`;
}
function forkjoin(pState, pIndent, pOptions) {
	const lClass = pState.class
		? `state ${pState.type} ${pState.class}`
		: `state ${pState.type}`;
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? "penwidth=3.0 " : "";
	const lDirection = getOptionValue(pOptions, "direction");
	const lSizingExtras = isVertical(lDirection) ? " height=0.1" : " width=0.1";
	return `${pIndent}  "${pState.name}" [shape=rect fixedsize=true label=" " style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}"${lActiveAttribute}${lSizingExtras}]`;
}
function junction(pState, pIndent) {
	const lClass = pState.class
		? `state junction ${pState.class}`
		: "state junction";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
	return `${pIndent}  "${pState.name}" [shape=circle fixedsize=true height=0.15 label="" style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}"${lActiveAttribute}]`;
}
function terminate(pState, pIndent) {
	const lClass = pState.class
		? `state terminate ${pState.class}"`
		: "state terminate";
	const lColor = pState.color ?? "black";
	const lLabel = he.escape(pState.label ?? pState.name);
	const lLabelTag = `
${pIndent}      <table align="center" cellborder="0" border="0">
${pIndent}        <tr><td cellpadding="0"><font color="${lColor}" point-size="20">X</font></td></tr>
${pIndent}        <tr><td cellpadding="0"><font color="${lColor}">${lLabel}</font></td></tr>
${pIndent}      </table>`;
	return `${pIndent}  "${pState.name}" [label= <${lLabelTag}
${pIndent}    > class="${lClass}"]`;
}
function final(pState, pIndent) {
	const lClass = pState.class ? `state final ${pState.class}"` : "state final";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}" fixedsize=true height=0.15 peripheries=2 label=""${lActiveAttribute}]`;
}
const STATE_TYPE2FUNCTION = new Map([
	["initial", initial],
	["regular", regular],
	["history", history],
	["deephistory", deepHistory],
	["choice", choice],
	["fork", forkjoin],
	["forkjoin", forkjoin],
	["join", forkjoin],
	["junction", junction],
	["terminate", terminate],
	["final", final],
]);
function state(pState, pIndent, pOptions) {
	return (
		(STATE_TYPE2FUNCTION.get(pState.type) ?? regular)(
			pState,
			pIndent,
			pOptions,
		) + "\n"
	);
}
function states(pStates, pIndent, pOptions) {
	return pStates.map((pState) => state(pState, pIndent, pOptions)).join("");
}
function transition(pTransition, pIndent) {
	const lLabel = `label="${escapeLabelString(pTransition.label ?? " ")}"`;
	const lColor = pTransition.color
		? `color="${pTransition.color}" fontcolor="${pTransition.color}"`
		: "";
	const lPenWidth = pTransition.width ? `penwidth=${pTransition.width}` : "";
	const lClass = pTransition.class
		? `class="transition ${pTransition.class}"`
		: 'class="transition"';
	const lAttributes = [];
	lAttributes.push(lLabel, lColor, lPenWidth, lClass);
	return `\n${pIndent}  "${pTransition.from}" -> "${pTransition.to}" [${lAttributes.filter(Boolean).join(" ")}]`;
}
function transitions(pTransitions, pIndent) {
	return pTransitions
		.map((pTransition) => transition(pTransition, pIndent))
		.join("");
}
function machine(pStateMachine, pIndent, pOptions) {
	return `${states(pStateMachine.states, pIndent, pOptions)}${transitions(pStateMachine.transitions || [], pIndent)}`;
}
export default function renderDot(pStateMachine, pOptions = {}, pIndent = "") {
	return template(pOptions, machine(pStateMachine, pIndent, pOptions));
}
