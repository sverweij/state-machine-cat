import Handlebars from "handlebars/dist/handlebars.runtime.js";
await import("./dot.template.js");
await import("./dot.states.template.js");
Handlebars.registerPartial("dot.states.template.hbs", Handlebars.templates["dot.states.template.hbs"]);
Handlebars.registerHelper("stateSection", (pStateMachine) => Handlebars.templates["dot.states.template.hbs"](splitStates(pStateMachine)));
function isType(pString) {
    return (pState) => pState.type === pString;
}
function isOneOfTypes(pStringArray) {
    return (pState) => pStringArray.includes(pState.type);
}
function splitStates(pStateMachine) {
    pStateMachine.initialStates = pStateMachine.states.filter(isType("initial"));
    pStateMachine.regularStates = pStateMachine.states.filter((pState) => isType("regular")(pState) && !pState.statemachine);
    pStateMachine.historyStates = pStateMachine.states.filter(isType("history"));
    pStateMachine.deepHistoryStates = pStateMachine.states.filter(isType("deephistory"));
    pStateMachine.choiceStates = pStateMachine.states.filter(isType("choice"));
    pStateMachine.forkjoinStates = pStateMachine.states.filter(isOneOfTypes(["fork", "join", "forkjoin"]));
    pStateMachine.junctionStates = pStateMachine.states.filter(isType("junction"));
    pStateMachine.terminateStates = pStateMachine.states.filter(isType("terminate"));
    pStateMachine.finalStates = pStateMachine.states.filter(isType("final"));
    pStateMachine.compositeStates = pStateMachine.states.filter((pState) => pState.statemachine);
    return pStateMachine;
}
export default function renderDotFromAST(pStateMachine) {
    return Handlebars.templates["dot.template.hbs"](pStateMachine);
}
