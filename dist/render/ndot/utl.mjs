import he from "he";
import { getOptionValue } from "../../options.mjs";
export function escapeString(pString) {
	return pString
		.replace(/\\/g, "\\\\")
		.replace(/\n\s*/g, "\\l")
		.replace(/"/g, '\\"')
		.concat("\\l");
}
export function escapeLabelString(pString) {
	return pString
		.replace(/\\/g, "\\\\")
		.replace(/\n\s*/g, "   \\l")
		.replace(/"/g, '\\"')
		.concat("   \\l");
}
export function isVertical(pDirection) {
	const lDirection = pDirection || "top-down";
	return lDirection === "top-down" || lDirection === "bottom-top";
}
export function isCompositeSelf(pStateMachineModel, pTransition) {
	return (
		pTransition.from === pTransition.to &&
		pStateMachineModel.findStateByName(pTransition.from).statemachine &&
		pTransition.type !== "internal"
	);
}
export function noteToLabel(pNote) {
	return pNote.map(escapeString).join("");
}
export function stateNote(pState, pIndent) {
	if (pState.note) {
		const lNoteName = `note_${pState.name}`;
		let lReturnValue = `\n${pIndent}  "${lNoteName}" [color=black fontcolor=black label="${noteToLabel(pState.note)}" shape=note fontsize=10 fillcolor="#ffffcc" penwidth=1.0]`;
		lReturnValue += `\n${pIndent}  "${pState.name}" -> "${lNoteName}" [style=dashed arrowtail=none arrowhead=none]`;
		return lReturnValue;
	}
	return "";
}
export function normalizeState(pState, pIndent) {
	const lReturnValue = structuredClone(pState);
	lReturnValue.color = pState.color ?? "black";
	lReturnValue.class = pState.class
		? `state ${pState.type} ${pState.class}`
		: `state ${pState.type}`;
	lReturnValue.label = he.escape(pState.label ?? pState.name);
	lReturnValue.noteText = stateNote(pState, pIndent);
	if (
		!pState.isParallelArea &&
		pState.type === "parallel" &&
		(pState.statemachine?.states ?? []).length > 0
	) {
		lReturnValue.statemachine.states = pState.statemachine.states.map(
			(pChildState) => ({
				...pChildState,
				isParallelArea: pChildState.type === "regular",
			}),
		);
	}
	return lReturnValue;
}
export function formatActionType(pString) {
	return pString === "activity" ? "" : `${pString}/ `;
}
export function getTransitionPorts(pOptions, pModel, pTransition) {
	let lTailPorts = 'tailport="n" headport="n" ';
	let lHeadPorts = 'tailport="n" ';
	const lDirection = getOptionValue(pOptions, "direction");
	if (isVertical(lDirection)) {
		lTailPorts = 'tailport="e" headport="e" ';
		lHeadPorts = 'tailport="w" ';
	} else if (pModel.findStateByName(pTransition.from).hasParent) {
		lTailPorts = 'tailport="n" headport="n" ';
		lHeadPorts = 'tailport="s" ';
	}
	return { lTailPorts, lHeadPorts };
}
