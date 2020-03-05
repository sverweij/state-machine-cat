const _get = require("lodash.get");
const utl = require("./utl");

function isType(pString) {
  return function(pState) {
    return pState.type === pString;
  };
}
function isOneOfTypes(pStringArray) {
  return function(pState) {
    return pStringArray.includes(pState.type);
  };
}

function setLabel(pState) {
  pState.label = pState.label || pState.name;
  return pState;
}

function nameNote(pState) {
  if (pState.hasOwnProperty("note")) {
    pState.noteName = `note_${pState.name}`;
  }
  return pState;
}

function formatActionType(pString) {
  return pString === "activity" ? "" : `${pString}/ `;
}

function flattenActions(pState) {
  const lRetval = Object.assign({}, pState);

  if (pState.actions) {
    lRetval.actions = pState.actions.map(
      pAction => `${formatActionType(pAction.type)}${pAction.body}`
    );
  }

  return lRetval;
}
function flattenNote(pState) {
  if (pState.hasOwnProperty("note")) {
    pState.noteFlattened = pState.note.join("");
  }
  return pState;
}

function recolor(pNodeAttrs) {
  return pState => {
    const lNodeColor = _get(
      (pNodeAttrs || []).find(pAttr => pAttr.name === "color"),
      "value"
    );
    if (
      lNodeColor &&
      !pState.color &&
      isOneOfTypes([
        "initial",
        "fork",
        "join",
        "junction",
        "forkjoin",
        "final"
      ])(pState)
    ) {
      pState.color = lNodeColor;
    }
    return pState;
  };
}

function escapeStateStrings(pState) {
  if (pState.note) {
    pState.note = pState.note.map(utl.escapeString);
  }
  return pState;
}

function tipForkJoinStates(pDirection) {
  return function(pState) {
    if (isOneOfTypes(["fork", "join", "forkjoin"])(pState)) {
      return Object.assign(
        {
          sizingExtras: utl.isVertical(pDirection) ? "height=0.1" : "width=0.1"
        },
        pState
      );
    }
    return pState;
  };
}

function flagParallelChildren(pState) {
  if (
    pState.type === "parallel" &&
    pState.statemachine &&
    pState.statemachine.states
  ) {
    pState.statemachine.states = pState.statemachine.states.map(pChildState =>
      isType("regular")(pChildState)
        ? Object.assign({}, pChildState, { parentIsParallel: true })
        : pChildState
    );
  }

  return pState;
}

module.exports = {
  isType,
  isOneOfTypes,
  setLabel,
  nameNote,
  flattenActions,
  flattenNote,
  recolor,
  escapeStateStrings,
  tipForkJoinStates,
  flagParallelChildren
};
