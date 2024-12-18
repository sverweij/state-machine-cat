/* eslint-disable no-use-before-define */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import he from "he";
import type {
  IStateMachine,
  IRenderOptions,
  IState,
  ITransition,
  StateType,
  IActionType,
} from "../../../types/state-machine-cat.mjs";
import { getOptionValue } from "../../options.mjs";
import StateMachineModel from "../../state-machine-model.mjs";
import {
  buildGraphAttributes,
  buildNodeAttributes,
  buildEdgeAttributes,
} from "./attributebuilder.mjs";
import { escapeLabelString, escapeString, isVertical } from "./utl.mjs";
import Counter from "./counter.mjs";

function noteToLabel(pNote: string[]): string {
  return pNote.map(escapeString).join("");
}

function stateNote(pState: IState, pIndent: string): string {
  if (pState.note) {
    const lNoteName = `note_${pState.name}`;
    let lReturnValue = `\n${pIndent}    "${lNoteName}" [color=black fontcolor=black label="${noteToLabel(pState.note)}" shape=note fontsize=10 fillcolor="#ffffcc" penwidth=1.0]`;

    lReturnValue += `\n${pIndent}    "${pState.name}" -> "${lNoteName}" [style=dashed arrowtail=none arrowhead=none]`;

    return lReturnValue;
  }
  return "";
}

function formatActionType(pString: string): string {
  return pString === "activity" ? "" : `${pString}/ `;
}

function initial(pState: IStateNormalized, pIndent: string): string {
  const lActiveAttribute = pState.active ? " penwidth=3.0" : "";

  return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${pState.class}" color="${pState.color}" fillcolor="${pState.color}" fixedsize=true height=0.15 label=""${lActiveAttribute}]${pState.noteText}`;
}

function regularStateActions(pActions: IActionType[], pIndent: string): string {
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

function compositeStateActions(
  pActions: IActionType[],
  pIndent: string,
): string {
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

function atomicRegular(pState: IStateNormalized, pIndent: string): string {
  const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
  // eslint-disable-next-line no-magic-numbers
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

function compositeRegular(
  pState: IStateNormalized,
  pIndent: string,
  pModel: StateMachineModel,
): string {
  const lPenWidth = pState.active ? "3.0" : "2.0";
  const lActions = compositeStateActions(pState?.actions ?? [], pIndent);
  const lLabel = pState.active ? `<i>${pState.label}</i>` : pState.label;
  const lLabelTag = `${pIndent}    <table cellborder="0" border="0">
${pIndent}      <tr><td>${lLabel}</td></tr>${lActions}
${pIndent}    </table>`;

  return `${pIndent}  subgraph "cluster_${pState.name}" {
${pIndent}    class="${pState.class}" color="${pState.color}" label= <
${lLabelTag}
${pIndent}    > style=rounded penwidth=${lPenWidth}
${pIndent}    "${pState.name}" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]
${machine(pState.statemachine ?? { states: [] }, `${pIndent}    `, {}, pModel)}
${pIndent}  }${pState.noteText}`;
  // :point_up: the (render-)machine function takes _options_ -> we pass a default here
  // but we propbably should just pass the options down.
}

function regular(
  pState: IStateNormalized,
  pIndent: string,
  _pOptions: IRenderOptions,
  pModel: StateMachineModel,
): string {
  if (pState.statemachine) {
    return compositeRegular(pState, pIndent, pModel);
  }
  return atomicRegular(pState, pIndent);
}

function history(pState: IStateNormalized, pIndent: string): string {
  const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";

  return `${pIndent}  "${pState.name}" [shape=circle class="${pState.class}" color="${pState.color}" label="H"${lActiveAttribute}]${pState.noteText}`;
}

function deepHistory(pState: IStateNormalized, pIndent: string): string {
  const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";

  return `${pIndent}  "${pState.name}" [shape=circle class="${pState.class}" color="${pState.color}" label="H*"${lActiveAttribute}]${pState.noteText}`;
}

function choiceActions(pActions: IActionType[], pActive: boolean): string {
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

function choice(pState: IStateNormalized, pIndent: string): string {
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

function forkjoin(
  pState: IStateNormalized,
  pIndent: string,
  pOptions: IRenderOptions,
): string {
  const lActiveAttribute = pState.active ? "penwidth=3.0 " : "";
  const lDirection = getOptionValue(pOptions, "direction") as string;
  const lSizingExtras = isVertical(lDirection) ? " height=0.1" : " width=0.1";

  return `${pIndent}  "${pState.name}" [shape=rect fixedsize=true label=" " style=filled class="${pState.class}" color="${pState.color}" fillcolor="${pState.color}"${lActiveAttribute}${lSizingExtras}]${pState.noteText}`;
}

function junction(pState: IStateNormalized, pIndent: string): string {
  const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
  const lNote = stateNote(pState, pIndent);

  return `${pIndent}  "${pState.name}" [shape=circle fixedsize=true height=0.15 label="" style=filled class="${pState.class}" color="${pState.color}" fillcolor="${pState.color}"${lActiveAttribute}]${lNote}`;
}

function terminate(pState: IStateNormalized, pIndent: string): string {
  const lLabelTag = `
${pIndent}      <table align="center" cellborder="0" border="0">
${pIndent}        <tr><td cellpadding="0"><font color="${pState.color}" point-size="20">X</font></td></tr>
${pIndent}        <tr><td cellpadding="0"><font color="${pState.color}">${pState.label}</font></td></tr>
${pIndent}      </table>`;

  return `${pIndent}  "${pState.name}" [label= <${lLabelTag}
${pIndent}    > class="${pState.class}"]${pState.noteText}`;
}

function final(pState: IStateNormalized, pIndent: string): string {
  const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";

  return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${pState.class}" color="${pState.color}" fillcolor="${pState.color}" fixedsize=true height=0.15 peripheries=2 label=""${lActiveAttribute}]${pState.noteText}`;
}
// @ts-expect-error - TS is yapping about something that just works  :shrug:
const STATE_TYPE2FUNCTION = new Map<
  StateType,
  (
    pState: IStateNormalized,
    pIndent: string,
    pOptions: IRenderOptions,
    pModel?: StateMachineModel,
  ) => string
>([
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
  // parallel
]);

interface IStateNormalized extends IState {
  color: string;
  class: string;
  label: string;
  noteText: string;
}

function normalizeState(pState: IState, pIndent: string): IStateNormalized {
  const lReturnValue = structuredClone(pState) as IStateNormalized;

  lReturnValue.color = pState.color ?? "black";
  lReturnValue.class = pState.class
    ? `state ${pState.type} ${pState.class}`
    : `state ${pState.type}`;
  lReturnValue.label = he.escape(pState.label ?? pState.name);
  lReturnValue.noteText = stateNote(pState, pIndent);

  return lReturnValue;
}

function state(
  pState: IState,
  pIndent: string,
  pOptions: IRenderOptions,
  pModel: StateMachineModel,
): string {
  const lState = normalizeState(pState, pIndent);
  return (
    // eslint-disable-next-line prefer-template
    (STATE_TYPE2FUNCTION.get(pState.type) ?? regular)(
      lState,
      pIndent,
      pOptions,
      pModel,
    ) + "\n"
  );
}

function states(
  pStates: IState[],
  pIndent: string,
  pOptions: IRenderOptions,
  pModel: StateMachineModel,
): string {
  return pStates
    .map((pState) => state(pState, pIndent, pOptions, pModel))
    .join("");
}

function transition(
  pTransition: ITransition,
  pIndent: string,
  pCounter: Counter,
  pModel: StateMachineModel,
): string {
  // TODO: should also be he.escape'd?
  const lLabel = `${escapeLabelString(pTransition.label ?? " ")}`;
  const lColor = pTransition.color ?? "black";

  const lPenWidth = pTransition.width ? ` penwidth=${pTransition.width}` : "";
  const lClass = pTransition.class
    ? `transition ${pTransition.class}`
    : "transition";
  const lTail = pModel.findStateByName(pTransition.from)?.statemachine
    ? `ltail="cluster_${pTransition.from}" `
    : "";
  const lHead = pModel.findStateByName(pTransition.to)?.statemachine
    ? `lhead="cluster_${pTransition.to}" `
    : "";
  if (pTransition.note) {
    const lTransitionName = `tr_${pTransition.from}_${pTransition.to}_${pCounter.nextAsString()}`;
    const lNoteName = `note_${lTransitionName}`;
    const lNoteNodeName = `i_${lNoteName}`;
    const lNoteNode = `\n${pIndent}    "${lNoteNodeName}" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]`;
    const lTransitionFrom = `\n${pIndent}    "${pTransition.from}" -> "${lNoteNodeName}" [arrowhead=none ${lTail}color="${lColor}"]`;
    const lTransitionTo = `\n${pIndent}    "${lNoteNodeName}" -> "${pTransition.to}" [label="${lLabel}" ${lHead}color="${lColor}" fontcolor="${lColor}"]`;
    const lLineToNote = `\n${pIndent}    "${lNoteNodeName}" -> "${lNoteName}" [style=dashed arrowtail=none arrowhead=none weight=0]`;
    const lNote = `\n${pIndent}    "${lNoteName}" [label="${noteToLabel(pTransition.note)}" shape=note fontsize=10 color=black fontcolor=black fillcolor="#ffffcc" penwidth=1.0]`;

    return lNoteNode + lTransitionFrom + lTransitionTo + lLineToNote + lNote;
  }

  return `\n${pIndent}  "${pTransition.from}" -> "${pTransition.to}" [label="${lLabel}" ${lTail}${lHead}color="${lColor}" fontcolor="${lColor}"${lPenWidth} class="${lClass}"]`;
}

function transitions(
  pTransitions: ITransition[],
  pIndent: string,
  pCounter: Counter,
  pModel: StateMachineModel,
): string {
  return pTransitions
    .map((pTransition) => transition(pTransition, pIndent, pCounter, pModel))
    .join("");
}

function machine(
  pStateMachine: IStateMachine,
  pIndent: string,
  pOptions: IRenderOptions,
  pModel: StateMachineModel,
): string {
  return `${states(pStateMachine.states, pIndent, pOptions, pModel)}${transitions(pStateMachine.transitions || [], pIndent, new Counter(), pModel)}`;
}

export default function renderDot(
  pStateMachine: IStateMachine,
  pOptions: IRenderOptions = {},
  pIndent: string = "",
): string {
  const lGraphAttributes = buildGraphAttributes(
    getOptionValue(pOptions, "engine") as string,
    getOptionValue(pOptions, "direction") as string,
    pOptions?.dotGraphAttrs || [],
  );
  const lNodeAttributes = buildNodeAttributes(pOptions.dotNodeAttrs || []);
  const lEdgeAttributes = buildEdgeAttributes(pOptions.dotNodeAttrs || []);
  const LModel = new StateMachineModel(pStateMachine);
  const lMachine = machine(pStateMachine, pIndent, pOptions, LModel);

  return `digraph "state transitions" {
  ${lGraphAttributes}
  node [${lNodeAttributes}]
  edge [${lEdgeAttributes}]

${lMachine}
}
`;
}
