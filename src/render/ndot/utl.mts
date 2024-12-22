import he from "he";
import { getOptionValue } from "../../options.mjs";
import type {
  IRenderOptions,
  IState,
  ITransition,
} from "../../../types/state-machine-cat.mjs";
import type StateMachineModel from "../../state-machine-model.mjs";

export function escapeString(pString: string): string {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "\\l")
    .replace(/"/g, '\\"')
    .concat("\\l");
}

export function escapeLabelString(pString: string): string {
  return pString
    .replace(/\\/g, "\\\\")
    .replace(/\n\s*/g, "   \\l")
    .replace(/"/g, '\\"')
    .concat("   \\l");
}

export function isVertical(pDirection: string): boolean {
  const lDirection = pDirection || "top-down";

  return lDirection === "top-down" || lDirection === "bottom-top";
}

export function isCompositeSelf(
  pStateMachineModel: StateMachineModel,
  pTransition: ITransition,
): boolean {
  return (
    pTransition.from === pTransition.to &&
    pStateMachineModel.findStateByName(pTransition.from).statemachine &&
    pTransition.type !== "internal"
  );
}

export interface IStateNormalized extends IState {
  color: string;
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
  pIndent: string,
): IStateNormalized {
  const lReturnValue = structuredClone(pState) as IStateNormalized;

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
  } else if (pModel.findStateByName(pTransition.from).hasParent) {
    lTailPorts = ' tailport="n" headport="n"';
    lHeadPorts = ' tailport="s"';
  }
  return { lTailPorts, lHeadPorts };
}
