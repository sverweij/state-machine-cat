/** @type {any} - the Handlebars delivered types don't seem to cover everythint in handlebars ...*/
const Handlebars = require("handlebars/dist/handlebars.runtime.js");
// eslint-disable-next-line import/no-unassigned-import
require("./dot.template.js");
// eslint-disable-next-line import/no-unassigned-import
require("./dot.states.template.js");

Handlebars.registerPartial(
  "dot.states.template.hbs",
  Handlebars.templates["dot.states.template.hbs"]
);

Handlebars.registerHelper("stateSection", (pStateMachine) =>
  // eslint-disable-next-line no-use-before-define
  Handlebars.templates["dot.states.template.hbs"](splitStates(pStateMachine))
);

// TODO: duplicate from the one in state-transformers.js
/**
 *
 * @param {string} pString
 * @returns {(pState: import("../../../types/state-machine-cat.js").IState) => Boolean}
 */
function isType(pString) {
  return (pState) => pState.type === pString;
}
/**
 *
 * @param {string[]} pStringArray
 * @returns {(pState: import("../../../types/state-machine-cat.js").IState) => Boolean}
 */
// TODO: duplicate from the one in state-transformers.js
function isOneOfTypes(pStringArray) {
  return (pState) => pStringArray.includes(pState.type);
}

// TODO: duplicate from the one in index.js
function splitStates(pStateMachine) {
  pStateMachine.initialStates = pStateMachine.states.filter(isType("initial"));
  pStateMachine.regularStates = pStateMachine.states.filter(
    (pState) => isType("regular")(pState) && !pState.statemachine
  );
  pStateMachine.historyStates = pStateMachine.states.filter(isType("history"));
  pStateMachine.deepHistoryStates = pStateMachine.states.filter(
    isType("deephistory")
  );
  pStateMachine.choiceStates = pStateMachine.states.filter(isType("choice"));
  pStateMachine.forkjoinStates = pStateMachine.states.filter(
    isOneOfTypes(["fork", "join", "forkjoin"])
  );
  pStateMachine.junctionStates = pStateMachine.states.filter(
    isType("junction")
  );
  pStateMachine.terminateStates = pStateMachine.states.filter(
    isType("terminate")
  );
  pStateMachine.finalStates = pStateMachine.states.filter(isType("final"));
  pStateMachine.compositeStates = pStateMachine.states.filter(
    (pState) => pState.statemachine
  );

  return pStateMachine;
}
/**
 * @param {import("../../../types/state-machine-cat.js").IStateMachine} pStateMachine
 * @returns {string}
 */
module.exports = function renderDotFromAST(pStateMachine) {
  return Handlebars.templates["dot.template.hbs"](pStateMachine);
};
