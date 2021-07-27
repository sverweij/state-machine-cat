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
function isType(pString) {
  return (pState) => pState.type === pString;
}
// TODO: duplicate from the one in state-transformers.js
function isOneOfTypes(pStringArray) {
  return (pState) => pStringArray.includes(pState.type);
}

// TODO: duplicate from the one in index.js
function splitStates(pAST) {
  pAST.initialStates = pAST.states.filter(isType("initial"));
  pAST.regularStates = pAST.states.filter(
    (pState) => isType("regular")(pState) && !pState.statemachine
  );
  pAST.historyStates = pAST.states.filter(isType("history"));
  pAST.deepHistoryStates = pAST.states.filter(isType("deephistory"));
  pAST.choiceStates = pAST.states.filter(isType("choice"));
  pAST.forkjoinStates = pAST.states.filter(
    isOneOfTypes(["fork", "join", "forkjoin"])
  );
  pAST.junctionStates = pAST.states.filter(isType("junction"));
  pAST.terminateStates = pAST.states.filter(isType("terminate"));
  pAST.finalStates = pAST.states.filter(isType("final"));
  pAST.compositeStates = pAST.states.filter((pState) => pState.statemachine);

  return pAST;
}

module.exports = function renderDotFromAST(pAST) {
  return Handlebars.templates["dot.template.hbs"](pAST);
};
