import utl from "./utl.mjs";
function isType(pString) {
    return (pState) => pState.type === pString;
}
function isOneOfTypes(pStringArray) {
    return (pState) => pStringArray.includes(pState.type);
}
function setLabel(pState) {
    const lState = structuredClone(pState);
    lState.label = pState.label ?? pState.name;
    return lState;
}
function nameNote(pState) {
    if (pState.note) {
        return {
            noteName: `note_${pState.name}`,
            ...pState,
        };
    }
    return pState;
}
function classifyState(pState) {
    const lState = { ...pState };
    const lClasses = ["state", pState.type];
    if (pState.class) {
        lClasses.push(pState.class.trim().replace(/[ ]{2,}/g, " "));
    }
    lState.class = lClasses.join(" ");
    return lState;
}
function formatActionType(pString) {
    return pString === "activity" ? "" : `${pString}/ `;
}
function flattenActions(pState) {
    if (pState.actions) {
        return {
            ...pState,
            actionStrings: pState.actions.map((pAction) => `${formatActionType(pAction.type)}${pAction.body}`),
        };
    }
    return pState;
}
function flattenNote(pState) {
    if (pState.note) {
        return {
            ...pState,
            noteFlattened: pState.note.join(""),
        };
    }
    return pState;
}
function recolor(pNodeAttributes) {
    return (pState) => {
        const lNodeColor = (pNodeAttributes || []).find((pAttribute) => pAttribute.name === "color")?.value;
        if (lNodeColor &&
            !pState.color &&
            isOneOfTypes([
                "initial",
                "fork",
                "join",
                "junction",
                "forkjoin",
                "final",
            ])(pState)) {
            pState.color = lNodeColor;
        }
        return pState;
    };
}
function escapeStateStrings(pState) {
    if (pState.note) {
        return {
            ...pState,
            note: pState.note.map(utl.escapeString),
        };
    }
    return pState;
}
function tipForkJoinStates(pDirection) {
    return (pState) => {
        if (isOneOfTypes(["fork", "join", "forkjoin"])(pState)) {
            return {
                sizingExtras: utl.isVertical(pDirection) ? "height=0.1" : "width=0.1",
                ...pState,
            };
        }
        return pState;
    };
}
function flagParallelChildren(pState) {
    if (pState.type === "parallel" && pState.statemachine?.states) {
        pState.statemachine.states = pState.statemachine.states.map((pChildState) => isType("regular")(pChildState)
            ? { ...pChildState, parentIsParallel: true }
            : pChildState);
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
