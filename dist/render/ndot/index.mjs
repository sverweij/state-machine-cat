import he from "he";
import { getOptionValue } from "../../options.mjs";
import {
	buildGraphAttributes,
	buildNodeAttributes,
	buildEdgeAttributes,
} from "./attributebuilder.mjs";
import { escapeLabelString, escapeString, isVertical } from "./utl.mjs";
import Counter from "./counter.mjs";
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
function noteToLabel(pNote) {
	return escapeString(pNote.join(""));
}
function stateNote(pState, pIndent) {
	if (pState.note) {
		const lNoteName = `note_${pState.name}`;
		let lReturnValue = `\n${pIndent}    "${lNoteName}" [color=black fontcolor=black label="${noteToLabel(pState.note)}" shape=note fontsize=10 fillcolor="#ffffcc" penwidth=1.0]`;
		lReturnValue += `\n${pIndent}    "${pState.name}" -> "${lNoteName}" [style=dashed arrowtail=none arrowhead=none]`;
		return lReturnValue;
	}
	return "";
}
function formatActionType(pString) {
	return pString === "activity" ? "" : `${pString}/ `;
}
function initial(pState, pIndent) {
	const lClass = pState.class
		? `state initial ${pState.class}"`
		: "state initial";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
	const lNote = stateNote(pState, pIndent);
	return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}" fixedsize=true height=0.15 label=""${lActiveAttribute}]${lNote}`;
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
	const lNote = stateNote(pState, pIndent);
	return `${pIndent}  "${pState.name}" [margin=0 class="${lClass}" color="${lColor}"${lActiveAttribute} label= <${lLabelTag}
${pIndent}  >]${lNote}`;
}
function history(pState, pIndent) {
	const lClass = pState.class
		? `state history ${pState.class}"`
		: "state history";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	const lNote = stateNote(pState, pIndent);
	return `${pIndent}  "${pState.name}" [shape=circle class="${lClass}" color="${lColor}" label="H"${lActiveAttribute}]${lNote}`;
}
function deepHistory(pState, pIndent) {
	const lClass = pState.class
		? `state deephistory ${pState.class}"`
		: "state deephistory";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	const lNote = stateNote(pState, pIndent);
	return `${pIndent}  "${pState.name}" [shape=circle class="${lClass}" color="${lColor}" label="H*"${lActiveAttribute}]${lNote}`;
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
	const lNote = stateNote(pState, pIndent);
	return `${lDiamond}\n${lLabelConstruct}${lNote}`;
}
function forkjoin(pState, pIndent, pOptions) {
	const lClass = pState.class
		? `state ${pState.type} ${pState.class}`
		: `state ${pState.type}`;
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? "penwidth=3.0 " : "";
	const lDirection = getOptionValue(pOptions, "direction");
	const lSizingExtras = isVertical(lDirection) ? " height=0.1" : " width=0.1";
	const lNote = stateNote(pState, pIndent);
	return `${pIndent}  "${pState.name}" [shape=rect fixedsize=true label=" " style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}"${lActiveAttribute}${lSizingExtras}]${lNote}`;
}
function junction(pState, pIndent) {
	const lClass = pState.class
		? `state junction ${pState.class}`
		: "state junction";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
	const lNote = stateNote(pState, pIndent);
	return `${pIndent}  "${pState.name}" [shape=circle fixedsize=true height=0.15 label="" style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}"${lActiveAttribute}]${lNote}`;
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
	const lNote = stateNote(pState, pIndent);
	return `${pIndent}  "${pState.name}" [label= <${lLabelTag}
${pIndent}    > class="${lClass}"]${lNote}`;
}
function final(pState, pIndent) {
	const lClass = pState.class ? `state final ${pState.class}"` : "state final";
	const lColor = pState.color ?? "black";
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	const lNote = stateNote(pState, pIndent);
	return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}" fixedsize=true height=0.15 peripheries=2 label=""${lActiveAttribute}]${lNote}`;
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
function transition(pTransition, pIndent, pCounter) {
	const lLabel = `${escapeLabelString(pTransition.label ?? " ")}`;
	const lColor = pTransition.color ?? "black";
	const lPenWidth = pTransition.width ? ` penwidth=${pTransition.width}` : "";
	const lClass = pTransition.class
		? `transition ${pTransition.class}`
		: "transition";
	const lAttributes = [];
	lAttributes.push(lLabel, lColor, lPenWidth, lClass);
	if (pTransition.note) {
		const lTransitionName = `tr_${pTransition.from}_${pTransition.to}_${pCounter.nextAsString()}`;
		const lNoteName = `note_${lTransitionName}`;
		const lNoteNodeName = `i_${lNoteName}`;
		const lNoteNode = `\n${pIndent}    "${lNoteNodeName}" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]`;
		const lTransitionSectionA = `\n${pIndent}    "${pTransition.from}" -> "${lNoteNodeName}" [arrowhead=none color="${lColor}"]`;
		const lTransitionSectionB = `\n${pIndent}    "${lNoteNodeName}" -> "${pTransition.to}" [label=${lLabel} color="${lColor}" fontcolor="${lColor}"]`;
		const lNoteAttachmentLine = `\n${pIndent}    "${lNoteNodeName}" -> "${lNoteName}" [style=dashed arrowtail=none arrowhead=none weight=0]`;
		const lNote = `\n${pIndent}    "${lNoteName}" [label="${noteToLabel(pTransition.note)}" shape=note fontsize=10 color=black fontcolor=black fillcolor="#ffffcc" penwidth=1.0]`;
		return (
			lNoteNode +
			lTransitionSectionA +
			lTransitionSectionB +
			lNoteAttachmentLine +
			lNote
		);
	}
	return `\n${pIndent}  "${pTransition.from}" -> "${pTransition.to}" [label="${lLabel}" color="${lColor}" fontcolor="${lColor}"${lPenWidth} class="${lClass}]"`;
}
function transitions(pTransitions, pIndent, pCounter) {
	return pTransitions
		.map((pTransition) => transition(pTransition, pIndent, pCounter))
		.join("");
}
function machine(pStateMachine, pIndent, pOptions) {
	return `${states(pStateMachine.states, pIndent, pOptions)}${transitions(pStateMachine.transitions || [], pIndent, new Counter())}`;
}
export default function renderDot(pStateMachine, pOptions = {}, pIndent = "") {
	return template(pOptions, machine(pStateMachine, pIndent, pOptions));
}
