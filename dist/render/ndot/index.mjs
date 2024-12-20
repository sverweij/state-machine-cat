import he from "he";
import { getOptionValue } from "../../options.mjs";
import StateMachineModel from "../../state-machine-model.mjs";
import {
	buildGraphAttributes,
	buildNodeAttributes,
	buildEdgeAttributes,
} from "./attributebuilder.mjs";
import {
	escapeLabelString,
	formatActionType,
	getTransitionPorts,
	isCompositeSelf,
	isVertical,
	noteToLabel,
	normalizeState,
	stateNote,
} from "./utl.mjs";
function initial(pState, pIndent) {
	const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
	return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${pState.class}" color="${pState.color}" fillcolor="${pState.color}" fixedsize=true height=0.15 label=""${lActiveAttribute}]${pState.noteText}`;
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
function compositeStateActions(pActions, pIndent) {
	return pActions
		.map((pAction) =>
			he.escape(`${formatActionType(pAction.type)}${pAction.body}`),
		)
		.map((pActionString, pIndex) => {
			let lReturnValue = `<tr><td align="left">${pActionString}</td></tr>`;
			if (pIndex === 0) {
				lReturnValue = `<hr/>${lReturnValue}`;
			}
			return `\n${pIndent}        ${lReturnValue}`;
		})
		.join("");
}
function atomicRegular(pState, pIndent) {
	const lActiveAttribute = pState.active ? " peripheries=1 style=rounded" : "";
	const lCellPadding = (pState.actions?.length ?? 0) > 0 ? 2 : 7;
	const lActions = regularStateActions(pState?.actions ?? [], pIndent);
	const lLabel = pState.active ? `<i>${pState.label}</i>` : pState.label;
	const lLabelTag = `
${pIndent}    <table align="center" cellborder="0" border="2" style="rounded" width="48">
${pIndent}      <tr><td width="48" cellpadding="${lCellPadding}">${lLabel}</td></tr>${lActions}
${pIndent}    </table>`;
	return `${pIndent}  "${pState.name}" [margin=0 class="${pState.class}" color="${pState.color}"${lActiveAttribute} label= <${lLabelTag}
${pIndent}  >]${pState.noteText}`;
}
function compositeRegular(pState, pIndent, pOptions, pModel) {
	const lPenWidth = pState.isParallelArea
		? "1.0"
		: pState.active
			? "3.0"
			: "2.0";
	const lStyle = pState.isParallelArea ? "dashed" : "rounded";
	const lActions = compositeStateActions(pState?.actions ?? [], pIndent);
	const lLabel = pState.active ? `<i>${pState.label}</i>` : pState.label;
	const lLabelTag = `${pIndent}    <table cellborder="0" border="0">
${pIndent}      <tr><td>${lLabel}</td></tr>${lActions}
${pIndent}    </table>`;
	const lSelfTransitionHelperPoints = pModel
		.findExternalSelfTransitions(pState.name)
		.map(
			(pTransition) =>
				`${pIndent}  "self_tr_${pTransition.from}_${pTransition.to}_${pTransition.id}" [shape=point style=invis width=0 height=0 fixedsize=true]\n`,
		)
		.join("");
	return `${lSelfTransitionHelperPoints}${pIndent}  subgraph "cluster_${pState.name}" {
${pIndent}    class="${pState.class}" color="${pState.color}" label= <
${lLabelTag}
${pIndent}    > style=${lStyle} penwidth=${lPenWidth}
${pIndent}    "${pState.name}" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]
${machine(pState.statemachine ?? { states: [] }, `${pIndent}    `, pOptions, pModel)}
${pIndent}  }${pState.noteText}`;
}
function regular(pState, pIndent, pOptions, pModel) {
	if (pState.statemachine) {
		return compositeRegular(pState, pIndent, pOptions, pModel);
	}
	return atomicRegular(pState, pIndent);
}
function history(pState, pIndent) {
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	return `${pIndent}  "${pState.name}" [shape=circle class="${pState.class}" color="${pState.color}" label="H"${lActiveAttribute}]${pState.noteText}`;
}
function deepHistory(pState, pIndent) {
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	return `${pIndent}  "${pState.name}" [shape=circle class="${pState.class}" color="${pState.color}" label="H*"${lActiveAttribute}]${pState.noteText}`;
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
	const lActiveAttribute = pState.active ? "penwidth=3.0 " : "";
	const lActions = choiceActions(
		pState?.actions ?? [],
		pState?.active ?? false,
	);
	const lLabelTag = lActions;
	const lDiamond = `${pIndent}  "${pState.name}" [shape=diamond fixedsize=true width=0.35 height=0.35 fontsize=10 label=" " class="${pState.class}" color="${pState.color}"${lActiveAttribute}]`;
	const lLabelConstruct = `${pIndent}  "${pState.name}" -> "${pState.name}" [color="#FFFFFF01" fontcolor="${pState.color}" class="${pState.class}" label=<${lLabelTag}>]`;
	return `${lDiamond}\n${lLabelConstruct}${pState.noteText}`;
}
function forkjoin(pState, pIndent, pOptions) {
	const lActiveAttribute = pState.active ? "penwidth=3.0 " : "";
	const lDirection = getOptionValue(pOptions, "direction");
	const lSizingExtras = isVertical(lDirection) ? " height=0.1" : " width=0.1";
	return `${pIndent}  "${pState.name}" [shape=rect fixedsize=true label=" " style=filled class="${pState.class}" color="${pState.color}" fillcolor="${pState.color}"${lActiveAttribute}${lSizingExtras}]${pState.noteText}`;
}
function junction(pState, pIndent) {
	const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
	const lNote = stateNote(pState, pIndent);
	return `${pIndent}  "${pState.name}" [shape=circle fixedsize=true height=0.15 label="" style=filled class="${pState.class}" color="${pState.color}" fillcolor="${pState.color}"${lActiveAttribute}]${lNote}`;
}
function terminate(pState, pIndent) {
	const lLabelTag = `
${pIndent}      <table align="center" cellborder="0" border="0">
${pIndent}        <tr><td cellpadding="0"><font color="${pState.color}" point-size="20">X</font></td></tr>
${pIndent}        <tr><td cellpadding="0"><font color="${pState.color}">${pState.label}</font></td></tr>
${pIndent}      </table>`;
	return `${pIndent}  "${pState.name}" [label= <${lLabelTag}
${pIndent}    > class="${pState.class}"]${pState.noteText}`;
}
function final(pState, pIndent) {
	const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
	return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${pState.class}" color="${pState.color}" fillcolor="${pState.color}" fixedsize=true height=0.15 peripheries=2 label=""${lActiveAttribute}]${pState.noteText}`;
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
function state(pState, pIndent, pOptions, pModel) {
	const lState = normalizeState(pState, pIndent);
	return (
		(STATE_TYPE2FUNCTION.get(pState.type) ?? regular)(
			lState,
			pIndent,
			pOptions,
			pModel,
		) + "\n"
	);
}
function states(pStates, pIndent, pOptions, pModel) {
	return pStates
		.map((pState) => state(pState, pIndent, pOptions, pModel))
		.join("");
}
function transition(pTransition, pIndent, pOptions, pModel) {
	const lLabel = `${escapeLabelString(pTransition.label ?? " ")}`;
	const lColor = pTransition.color ?? "black";
	const lPenWidth = pTransition.width ? ` penwidth=${pTransition.width}` : "";
	const lClass = pTransition.class
		? `transition${pTransition.type ? " " + pTransition.type + " " : " "}${pTransition.class}`
		: `transition${pTransition.type ? " " + pTransition.type : ""}`;
	const lTail = pModel.findStateByName(pTransition.from)?.statemachine
		? `ltail="cluster_${pTransition.from}" `
		: "";
	const lHead = pModel.findStateByName(pTransition.to)?.statemachine
		? `lhead="cluster_${pTransition.to}" `
		: "";
	const lTransitionName = `tr_${pTransition.from}_${pTransition.to}_${pTransition.id}`;
	if (pTransition.note) {
		const lNoteName = `note_${lTransitionName}`;
		const lNoteNodeName = `i_${lNoteName}`;
		const lNoteNode = `\n${pIndent}  "${lNoteNodeName}" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]`;
		const lTransitionFrom = `\n${pIndent}  "${pTransition.from}" -> "${lNoteNodeName}" [arrowhead=none ${lTail}color="${lColor}"]`;
		const lTransitionTo = `\n${pIndent}  "${lNoteNodeName}" -> "${pTransition.to}" [label="${lLabel}" ${lHead}color="${lColor}" fontcolor="${lColor}"]`;
		const lLineToNote = `\n${pIndent}  "${lNoteNodeName}" -> "${lNoteName}" [style=dashed arrowtail=none arrowhead=none weight=0]`;
		const lNote = `\n${pIndent}  "${lNoteName}" [label="${noteToLabel(pTransition.note)}" shape=note fontsize=10 color=black fontcolor=black fillcolor="#ffffcc" penwidth=1.0]`;
		return lNoteNode + lTransitionFrom + lTransitionTo + lLineToNote + lNote;
	}
	if (isCompositeSelf(pModel, pTransition)) {
		const { lTailPorts, lHeadPorts } = getTransitionPorts(
			pOptions,
			pModel,
			pTransition,
		);
		const lTransitionFrom = `\n${pIndent}  "${pTransition.from}" -> "self_tr_${pTransition.from}_${pTransition.to}_${pTransition.id}" [label="${lLabel}" arrowhead=none ${lTailPorts}${lTail}color="${lColor}" fontcolor="${lColor}" class="${lClass}"]`;
		const lTransitionTo = `\n${pIndent}  "self_tr_${pTransition.from}_${pTransition.to}_${pTransition.id}" -> "${pTransition.to}" [${lHead}${lHeadPorts}color="${lColor}" ${lPenWidth}class="${lClass}"]`;
		return lTransitionFrom + lTransitionTo;
	}
	return `\n${pIndent}  "${pTransition.from}" -> "${pTransition.to}" [label="${lLabel}" ${lTail}${lHead}color="${lColor}" fontcolor="${lColor}"${lPenWidth} class="${lClass}"]`;
}
function transitions(pTransitions, pIndent, pOptions, pModel) {
	return pTransitions
		.map((pTransition) => transition(pTransition, pIndent, pOptions, pModel))
		.join("");
}
function machine(pStateMachine, pIndent, pOptions, pModel) {
	return `${states(pStateMachine.states, pIndent, pOptions, pModel)}${transitions(pStateMachine.transitions || [], pIndent, pOptions, pModel)}`;
}
export default function renderDot(pStateMachine, pOptions = {}, pIndent = "") {
	const lGraphAttributes = buildGraphAttributes(
		getOptionValue(pOptions, "engine"),
		getOptionValue(pOptions, "direction"),
		pOptions?.dotGraphAttrs || [],
	);
	const lNodeAttributes = buildNodeAttributes(pOptions.dotNodeAttrs || []);
	const lEdgeAttributes = buildEdgeAttributes(pOptions.dotNodeAttrs || []);
	const lModel = new StateMachineModel(pStateMachine);
	const lMachine = machine(pStateMachine, pIndent, pOptions, lModel);
	return `digraph "state transitions" {
  ${lGraphAttributes}
  node [${lNodeAttributes}]
  edge [${lEdgeAttributes}]

${lMachine}
}
`;
}
