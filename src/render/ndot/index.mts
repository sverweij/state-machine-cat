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
import {
  buildGraphAttributes,
  buildNodeAttributes,
  buildEdgeAttributes,
} from "./attributebuilder.mjs";
import { escapeLabelString, isVertical } from "./utl.mjs";

function template(pOptions: IRenderOptions, pMachine: string): string {
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
        getOptionValue(pOptions, "engine") as string,
        getOptionValue(pOptions, "direction") as string,
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

function stateNote(pState: IState, pIndent: string): string {
  if (pState.note) {
    const lNoteName = `note_${pState.name}`;
    let lReturnValue = `\n${pIndent}    "${lNoteName}" [color=black fontcolor=black label="${pState.note.join("\\l").concat("\\l")}" shape=note fontsize=10 fillcolor="#ffffcc" penwidth=1.0]`;

    lReturnValue += `\n${pIndent}    "${pState.name}" -> "${lNoteName}" [style=dashed arrowtail=none arrowhead=none]`;

    return lReturnValue;
  }
  return "";
}

function formatActionType(pString: string): string {
  return pString === "activity" ? "" : `${pString}/ `;
}

function initial(pState: IState, pIndent: string): string {
  const lClass = pState.class
    ? `state initial ${pState.class}"`
    : "state initial";
  const lColor = pState.color ?? "black";
  const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
  const lNote = stateNote(pState, pIndent);

  return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}" fixedsize=true height=0.15 label=""${lActiveAttribute}]${lNote}`;
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
function regular(pState: IState, pIndent: string): string {
  const lClass = pState.class
    ? `state regular ${pState.class}"`
    : "state regular";
  const lColor = pState.color ?? "black";
  const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
  // eslint-disable-next-line no-magic-numbers
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

function history(pState: IState, pIndent: string): string {
  const lClass = pState.class
    ? `state history ${pState.class}"`
    : "state history";
  const lColor = pState.color ?? "black";
  const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
  const lNote = stateNote(pState, pIndent);

  return `${pIndent}  "${pState.name}" [shape=circle class="${lClass}" color="${lColor}" label="H"${lActiveAttribute}]${lNote}`;
}

function deepHistory(pState: IState, pIndent: string): string {
  const lClass = pState.class
    ? `state deephistory ${pState.class}"`
    : "state deephistory";
  const lColor = pState.color ?? "black";
  const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
  const lNote = stateNote(pState, pIndent);

  return `${pIndent}  "${pState.name}" [shape=circle class="${lClass}" color="${lColor}" label="H*"${lActiveAttribute}]${lNote}`;
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

function choice(pState: IState, pIndent: string): string {
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

function forkjoin(
  pState: IState,
  pIndent: string,
  pOptions: IRenderOptions,
): string {
  const lClass = pState.class
    ? `state ${pState.type} ${pState.class}`
    : `state ${pState.type}`;
  const lColor = pState.color ?? "black";
  const lActiveAttribute = pState.active ? "penwidth=3.0 " : "";
  const lDirection = getOptionValue(pOptions, "direction") as string;
  const lSizingExtras = isVertical(lDirection) ? " height=0.1" : " width=0.1";
  const lNote = stateNote(pState, pIndent);

  return `${pIndent}  "${pState.name}" [shape=rect fixedsize=true label=" " style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}"${lActiveAttribute}${lSizingExtras}]${lNote}`;
}

function junction(pState: IState, pIndent: string): string {
  const lClass = pState.class
    ? `state junction ${pState.class}`
    : "state junction";
  const lColor = pState.color ?? "black";
  const lActiveAttribute = pState.active ? " penwidth=3.0" : "";
  const lNote = stateNote(pState, pIndent);

  return `${pIndent}  "${pState.name}" [shape=circle fixedsize=true height=0.15 label="" style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}"${lActiveAttribute}]${lNote}`;
}

function terminate(pState: IState, pIndent: string): string {
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

function final(pState: IState, pIndent: string): string {
  const lClass = pState.class ? `state final ${pState.class}"` : "state final";
  const lColor = pState.color ?? "black";
  const lActiveAttribute = pState.active ? " peripheries=2 penwidth=3.0" : "";
  const lNote = stateNote(pState, pIndent);

  return `${pIndent}  "${pState.name}" [shape=circle style=filled class="${lClass}" color="${lColor}" fillcolor="${lColor}" fixedsize=true height=0.15 peripheries=2 label=""${lActiveAttribute}]${lNote}`;
}

const STATE_TYPE2FUNCTION = new Map<
  StateType,
  (pState: IState, pIndent: string, pOptions: IRenderOptions) => string
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

function state(
  pState: IState,
  pIndent: string,
  pOptions: IRenderOptions,
): string {
  return (
    // eslint-disable-next-line prefer-template
    (STATE_TYPE2FUNCTION.get(pState.type) ?? regular)(
      pState,
      pIndent,
      pOptions,
    ) + "\n"
  );
}

function states(
  pStates: IState[],
  pIndent: string,
  pOptions: IRenderOptions,
): string {
  return pStates.map((pState) => state(pState, pIndent, pOptions)).join("");
}

function transition(pTransition: ITransition, pIndent: string): string {
  // TODO: should also be he.escape'd?
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

function transitions(pTransitions: ITransition[], pIndent: string): string {
  return pTransitions
    .map((pTransition) => transition(pTransition, pIndent))
    .join("");
}

function machine(
  pStateMachine: IStateMachine,
  pIndent: string,
  pOptions: IRenderOptions,
): string {
  return `${states(pStateMachine.states, pIndent, pOptions)}${transitions(pStateMachine.transitions || [], pIndent)}`;
}

export default function renderDot(
  pStateMachine: IStateMachine,
  pOptions: IRenderOptions = {},
  pIndent: string = "",
): string {
  return template(pOptions, machine(pStateMachine, pIndent, pOptions));
}
