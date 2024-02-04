import type { IState } from "types/state-machine-cat.mjs";
import type { IExtendedState } from "./extended-types.js";
import utl from "./utl.mjs";

function isType(pString: string) {
  return (pState: IState): boolean => pState.type === pString;
}
function isOneOfTypes(pStringArray: string[]) {
  return (pState: IState): boolean => pStringArray.includes(pState.type);
}

function setLabel(pState: IExtendedState): IExtendedState {
  const lState = structuredClone(pState);
  lState.label = pState.label || pState.name;
  return lState;
}

function nameNote(pState: IExtendedState): IExtendedState {
  if (pState.note) {
    return {
      noteName: `note_${pState.name}`,
      ...pState,
    };
  }
  return pState;
}

function classifyState(pState: IExtendedState): IExtendedState {
  const lState = { ...pState };
  const lClasses = ["state", pState.type];

  if (pState.class) {
    lClasses.push(pState.class.trim().replace(/[ ]{2,}/g, " "));
  }

  lState.class = lClasses.join(" ");
  return lState;
}

function formatActionType(pString: string): string {
  return pString === "activity" ? "" : `${pString}/ `;
}

function flattenActions(pState: IExtendedState): IExtendedState {
  if (pState.actions) {
    return {
      ...pState,
      actionStrings: pState.actions.map(
        (pAction) => `${formatActionType(pAction.type)}${pAction.body}`,
      ),
    };
  }

  return pState as IExtendedState;
}

function flattenNote(pState: IExtendedState): IExtendedState {
  if (pState.note) {
    return {
      ...(pState as IExtendedState),
      noteFlattened: pState.note.join(""),
    };
  }
  return pState;
}

function recolor(pNodeAttributes: { name: string; value: string }[]) {
  return (pState: IState): IState => {
    const lNodeColor = (pNodeAttributes || []).find(
      (pAttribute) => pAttribute.name === "color",
    )?.value;

    if (
      lNodeColor &&
      !pState.color &&
      isOneOfTypes([
        "initial",
        "fork",
        "join",
        "junction",
        "forkjoin",
        "final",
      ])(pState)
    ) {
      pState.color = lNodeColor;
    }
    return pState;
  };
}

function escapeStateStrings(pState: IExtendedState): IExtendedState {
  if (pState.note) {
    return {
      ...pState,
      note: pState.note.map(utl.escapeString),
    };
  }
  return pState;
}

function tipForkJoinStates(pDirection: string) {
  return (pState: IState): IExtendedState => {
    if (isOneOfTypes(["fork", "join", "forkjoin"])(pState)) {
      return {
        sizingExtras: utl.isVertical(pDirection) ? "height=0.1" : "width=0.1",
        ...(pState as IExtendedState),
      };
    }
    return pState as IExtendedState;
  };
}

function flagParallelChildren(pState: IExtendedState): IExtendedState {
  if (
    pState.type === "parallel" &&
    pState.statemachine &&
    pState.statemachine.states
  ) {
    pState.statemachine.states = pState.statemachine.states.map(
      (pChildState: IState) =>
        isType("regular")(pChildState)
          ? { ...pChildState, parentIsParallel: true }
          : pChildState,
    );
  }

  return pState;
}

export default {
  isType,
  isOneOfTypes,
  setLabel,
  classifyState,
  nameNote,
  flattenActions,
  flattenNote,
  recolor,
  escapeStateStrings,
  tipForkJoinStates,
  flagParallelChildren,
};
