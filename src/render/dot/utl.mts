import he from "he";
import { getOptionValue } from "../../options.mjs";
import type {
  dotAttributesType,
  IRenderOptions,
  IState,
  ITransition,
} from "../../../types/state-machine-cat.mjs";
import type StateMachineModel from "../../state-machine-model.mjs";

const COLORABLE_STATE_TYPES: Set<string> = new Set([
  "initial",
  "fork",
  "join",
  "junction",
  "forkjoin",
  "terminate",
  "final",
]);

// eslint-disable-next-line complexity
function getStateColor(
  pState: IState,
  pNodeAttributes?: dotAttributesType,
): string {
  const lNodeColor = (pNodeAttributes || []).find(
    (pAttribute) => pAttribute.name === "color",
  )?.value;

  if (lNodeColor && !pState.color && COLORABLE_STATE_TYPES.has(pState.type)) {
    return lNodeColor;
  }
  return pState.color ?? "black";
}

export function escapeString(pString: string): string {
  return pString
    .replaceAll("\\", String.raw`\\`)
    .replaceAll(/\n\s*/g, String.raw`\l`)
    .replaceAll('"', String.raw`\"`)
    .concat(String.raw`\l`);
}

export function escapeLabelString(pString: string): string {
  return pString
    .replaceAll("\\", String.raw`\\`)
    .replaceAll(/\n\s*/g, String.raw`   \l`)
    .replaceAll('"', String.raw`\"`)
    .concat(String.raw`   \l`);
}

// TODO integrate this into the normalization

export function isVertical(pDirection: string | null): boolean {
  const lDirection = pDirection || "top-down";

  return lDirection === "top-down" || lDirection === "bottom-top";
}

export function isCompositeSelf(
  pStateMachineModel: StateMachineModel,
  pTransition: ITransition,
): boolean {
  return (
    pTransition.from === pTransition.to &&
    (pStateMachineModel.findStateByName(pTransition.from)?.statemachine ??
      false) &&
    pTransition.type !== "internal"
  );
}

export interface IStateNormalized extends IState {
  colorAttribute: string;
  fontColorAttribute: string;
  class: string;
  label: string;
  noteText: string;
  isParallelArea: boolean;
}

export function noteToLabel(pNote: string[]): string {
  return pNote.map(escapeString).join("");
}

export function stateNote(pState: IState, pIndent: string): string {
  if (pState.note) {
    const lNoteName = `note_${pState.name}`;
    let lReturnValue = `\n${pIndent}  "${lNoteName}" [color=black fontcolor=black label="${noteToLabel(pState.note)}" shape=note fontsize=10 fillcolor="#ffffcc" penwidth=1.0]`;

    lReturnValue += `\n${pIndent}  "${pState.name}" -> "${lNoteName}" [style=dashed arrowtail=none arrowhead=none]`;

    return lReturnValue;
  }
  return "";
}

// eslint-disable-next-line complexity
export function normalizeState(
  pState: IState & Partial<IStateNormalized>,
  pOptions: IRenderOptions,
  pIndent: string,
): IStateNormalized {
  const lReturnValue = structuredClone(pState) as IStateNormalized;

  // TODO: this is kludgy
  // we use these in regular, composite and history states
  lReturnValue.colorAttribute = pState.color ? ` color="${pState.color}"` : "";
  lReturnValue.fontColorAttribute = pState.color
    ? ` fontcolor="${pState.color}"`
    : "";
  // we use these in initial, fork, join, junction, forkjoin, terminal and final states
  lReturnValue.color = getStateColor(pState, pOptions.dotNodeAttrs);

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
    // @ts-expect-error as lReturnValue is a clone of pStates statemachine && states
    //                  are bound to exist on there as well.
    lReturnValue.statemachine.states = pState.statemachine.states.map(
      (pChildState) => ({
        ...pChildState,
        isParallelArea: pChildState.type === "regular",
      }),
    );
  }

  return lReturnValue;
}

export function formatActionType(pString: string): string {
  return pString === "activity" ? "" : `${pString}/ `;
}

export function getTransitionPorts(
  pOptions: IRenderOptions,
  pModel: StateMachineModel,
  pTransition: ITransition,
) {
  let lTailPorts = ' tailport="n" headport="n"';
  let lHeadPorts = ' tailport="n"';
  const lDirection = getOptionValue(pOptions, "direction") as string;
  if (isVertical(lDirection)) {
    lTailPorts = ' tailport="e" headport="e"';
    lHeadPorts = ' tailport="w"';
  } else if (pModel.findStateByName(pTransition.from)?.parent ?? false) {
    lTailPorts = ' tailport="n" headport="n"';
    lHeadPorts = ' tailport="s"';
  }
  return { lTailPorts, lHeadPorts };
}
