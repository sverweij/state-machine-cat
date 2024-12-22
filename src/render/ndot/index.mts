/* eslint-disable max-lines */
/* eslint-disable no-use-before-define */
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
import {
  escapeLabelString,
  formatActionType,
  getTransitionPorts,
  isCompositeSelf,
  isVertical,
  type IStateNormalized,
  noteToLabel,
  normalizeState,
  stateNote,
} from "./utl.mjs";

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

// TODO: regularStateActions and compositeStateActions differ by the 'cellpadding' attribute
//       - would it hurt to add it to the composite, so we can have just one function?
//       - if not - parametrize?
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
  const lActiveAttribute = pState.active ? " peripheries=1 style=rounded" : "";
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
  pOptions: IRenderOptions,
  pModel: StateMachineModel,
): string {
  // eslint-disable-next-line no-nested-ternary
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
${states(pState?.statemachine?.states ?? [], `${pIndent}    `, pOptions, pModel)}
${pIndent}  }${pState.noteText}`;
}

function regular(
  pState: IStateNormalized,
  pIndent: string,
  pOptions: IRenderOptions,
  pModel: StateMachineModel,
): string {
  if (pState.statemachine) {
    return compositeRegular(pState, pIndent, pOptions, pModel);
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

// eslint-disable-next-line max-statements, max-lines-per-function
function transition(
  pTransition: ITransition,
  pIndent: string,
  pOptions: IRenderOptions,
  pModel: StateMachineModel,
): string {
  // TODO: should also be he.escape'd?
  const lLabel = `${escapeLabelString(pTransition.label ?? " ")}`;
  // using a default color  (`pTransition.color ?? "black"`) makes the output
  // look more consistent and easier to check, but it also blocks the 'inheritance'
  //
  const lColor = pTransition.color ? ` color="${pTransition.color}"` : "";
  const lFontColor = pTransition.color
    ? ` fontcolor="${pTransition.color}"`
    : "";
  const lPenWidth = pTransition.width ? ` penwidth=${pTransition.width}` : "";
  const lClass = pTransition.class
    ? // eslint-disable-next-line prefer-template
      `transition${pTransition.type ? " " + pTransition.type + " " : " "}${pTransition.class}`
    : // eslint-disable-next-line prefer-template
      `transition${pTransition.type ? " " + pTransition.type : ""}`;
  // for transitions to/ from composite states put the _cluster_ as the head
  // instead of the state itself
  const lTail = pModel.findStateByName(pTransition.from)?.statemachine
    ? ` ltail="cluster_${pTransition.from}"`
    : "";
  const lHead = pModel.findStateByName(pTransition.to)?.statemachine
    ? ` lhead="cluster_${pTransition.to}"`
    : "";
  const lTransitionName = `tr_${pTransition.from}_${pTransition.to}_${pTransition.id}`;

  // to attach a note, split the transition in half, reconnect them via an
  // in-between point and connect the note to that in-between point as well
  if (pTransition.note) {
    const lNoteName = `note_${lTransitionName}`;
    const lNoteNodeName = `i_${lNoteName}`;
    const lNoteNode = `\n${pIndent}  "${lNoteNodeName}" [shape=point style=invis margin=0 width=0 height=0 fixedsize=true]`;
    const lTransitionFrom = `\n${pIndent}  "${pTransition.from}" -> "${lNoteNodeName}" [arrowhead=none${lTail}${lColor}]`;
    const lTransitionTo = `\n${pIndent}  "${lNoteNodeName}" -> "${pTransition.to}" [label="${lLabel}"${lHead}${lColor}${lFontColor}]`;
    const lLineToNote = `\n${pIndent}  "${lNoteNodeName}" -> "${lNoteName}" [style=dashed arrowtail=none arrowhead=none weight=0]`;
    const lNote = `\n${pIndent}  "${lNoteName}" [label="${noteToLabel(pTransition.note)}" shape=note fontsize=10 color=black fontcolor=black fillcolor="#ffffcc" penwidth=1.0]`;

    return lNoteNode + lTransitionFrom + lTransitionTo + lLineToNote + lNote;
  }

  if (isCompositeSelf(pModel, pTransition)) {
    // for self-transitions to/ from composite states ensure the transition leaves
    // and enters to/ from the right side of the state
    const { lTailPorts, lHeadPorts } = getTransitionPorts(
      pOptions,
      pModel,
      pTransition,
    );

    // the invisible 'self' node is declared with the state. If we do it later
    // the transition is going to look ugly
    // TODO shouldn't there be a penwidth in the from transition as well?
    const lTransitionFrom = `\n${pIndent}  "${pTransition.from}" -> "self_tr_${pTransition.from}_${pTransition.to}_${pTransition.id}" [label="${lLabel}" arrowhead=none class="${lClass}"${lTailPorts}${lTail}${lColor}${lFontColor}]`;
    const lTransitionTo = `\n${pIndent}  "self_tr_${pTransition.from}_${pTransition.to}_${pTransition.id}" -> "${pTransition.to}" [class="${lClass}"${lHead}${lHeadPorts}${lColor}${lPenWidth}]`;
    return lTransitionFrom + lTransitionTo;
  }

  // TODO: corner case
  //       a composite self transition with a note wasn't handled in the original code
  //       either - so you'd get a self transition with a note only, which works
  //       but doesn't look great.

  return `\n${pIndent}  "${pTransition.from}" -> "${pTransition.to}" [label="${lLabel}" class="${lClass}"${lTail}${lHead}${lColor}${lFontColor}${lPenWidth}]`;
}

function transitions(
  pTransitions: ITransition[],
  pIndent: string,
  pOptions: IRenderOptions,
  pModel: StateMachineModel,
): string {
  return pTransitions
    .map((pTransition) => transition(pTransition, pIndent, pOptions, pModel))
    .join("");
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
  const lEdgeAttributes = buildEdgeAttributes(pOptions.dotEdgeAttrs || []);
  const lModel = new StateMachineModel(pStateMachine);
  const lStates = states(pStateMachine.states, pIndent, pOptions, lModel);
  // ideally, we render transitions together with the states. However, in graphviz
  // that only renders as we want to if we if the transition is _within_ the state.
  // This guy renders a within cluster_b, though.
  // digraph {
  //   a
  //     subgraph "cluster_b" {
  //     label=b
  //       ba
  //       ba -> a
  //   }
  // }
  // one way to escape that is to render all transitions separately in one go
  // which (accidentally) did in the previous render engine. For now we're
  // going to do that here as well.
  // Another way would be to render the transitions in the most outer state of
  // the (to, from).
  const lTransitions = transitions(
    lModel.flattenedTransitions,
    pIndent,
    pOptions,
    lModel,
  );

  return `digraph "state transitions" {
  ${lGraphAttributes}
  node [${lNodeAttributes}]
  edge [${lEdgeAttributes}]

${lStates}${lTransitions}
}
`;
}
