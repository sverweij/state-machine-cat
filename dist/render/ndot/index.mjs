import he from "he";
import { getOptionValue } from "../../options.mjs";
import { buildGraphAttributes, buildNodeAttributes, buildEdgeAttributes, } from "./attributebuilder.mjs";
import { escapeLabelString } from "./utl.mjs";
function template(pOptions, pMachine) {
    const lTemplate = `digraph "state transitions" {
  {{graphAttributes}}
  node [{{nodeAttributes}}]
  edge [{{edgeAttributes}}]

{{machine}}
}
`;
    return lTemplate
        .replace("{{graphAttributes}}", buildGraphAttributes(getOptionValue(pOptions, "engine"), getOptionValue(pOptions, "direction"), pOptions?.dotGraphAttrs || []))
        .replace("{{nodeAttributes}}", buildNodeAttributes(pOptions.dotNodeAttrs || []))
        .replace("{{edgeAttributes}}", buildEdgeAttributes(pOptions.dotNodeAttrs || []))
        .replace("{{machine}}", pMachine);
}
function formatActionType(pString) {
    return pString === "activity" ? "" : `${pString}/ `;
}
function regularStateActions(pActions, pIndent) {
    return pActions
        .map((pAction) => he.escape(`${formatActionType(pAction.type)}${pAction.body}`))
        .map((pActionString, pIndex) => {
        let lReturnValue = `<tr><td align="left" cellpadding="2">${pActionString}</td></tr>`;
        if (pIndex === 0) {
            lReturnValue = `<hr/>${lReturnValue}`;
        }
        return `\n${pIndent}        ${lReturnValue}`;
    })
        .join("");
}
function regularState(pState, pIndent) {
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
function initialState(pState, pIndent) {
    const lClass = pState.class
        ? `state initial ${pState.class}"`
        : "state initial";
    const lColor = pState.color ?? "black";
    const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
    return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}" fixedsize=true height=0.15 label=""${lActiveAttribute}]`;
}
function historyState(pState, pIndent) {
    const lClass = pState.class
        ? `state history ${pState.class}"`
        : "state history";
    const lColor = pState.color ?? "black";
    const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
    return `${pIndent}  "${pState.name}" [shape=circle class="${lClass}" color="${lColor}" label="H"${lActiveAttribute}]`;
}
function deepHistoryState(pState, pIndent) {
    const lClass = pState.class
        ? `state history ${pState.class}"`
        : "state history";
    const lColor = pState.color ?? "black";
    const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
    return `${pIndent}  "${pState.name}" [shape=circle class="${lClass}" color="${lColor}" label="H*"${lActiveAttribute}]`;
}
function finalState(pState, pIndent) {
    const lClass = pState.class ? `state final ${pState.class}"` : "state final";
    const lColor = pState.color ?? "black";
    const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
    return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}" fixedsize=true height=0.15 peripheries=2 label=""${lActiveAttribute}]`;
}
const STATE_TYPE2FUNCTION = new Map([
    ["initial", initialState],
    ["regular", regularState],
    ["history", historyState],
    ["deephistory", deepHistoryState],
    ["choice", regularState],
    ["fork", regularState],
    ["forkjoin", regularState],
    ["join", regularState],
    ["junction", regularState],
    ["terminate", regularState],
    ["final", finalState],
]);
function state(pState, pIndent) {
    return ((STATE_TYPE2FUNCTION.get(pState.type) ?? regularState)(pState, pIndent) +
        "\n");
}
function states(pStates, pIndent) {
    return pStates.map((pState) => state(pState, pIndent)).join("");
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
    return `${pIndent}  "${pTransition.from}" -> "${pTransition.to}" [${lAttributes.filter(Boolean).join(" ")}]`;
}
function transitions(pTransitions, pIndent) {
    return pTransitions
        .map((pTransition) => transition(pTransition, pIndent))
        .join("\n");
}
function machine(pStateMachine, pIndent) {
    return `${states(pStateMachine.states, pIndent)}${transitions(pStateMachine.transitions || [], pIndent)}`;
}
export default function renderDot(pStateMachine, pOptions = {}, pIndent = "") {
    return template(pOptions, machine(pStateMachine, pIndent));
}
