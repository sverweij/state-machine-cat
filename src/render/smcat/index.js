const Handlebars = require("handlebars/dist/handlebars.runtime");
const _clonedeep = require("lodash.clonedeep");

/* eslint import/no-unassigned-import: 0 */
require("./smcat.template");

const NAME_QUOTABLE = new RegExp(";|,|{| |\\[");
const ACTIONS_QUOTABLE = new RegExp(";|,|{");
const LABEL_QUOTABLE = new RegExp(";|{");

function quoteIfNecessary(pRegExp, pString) {
  return pRegExp.test(pString) ? `"${pString}"` : pString;
}

Handlebars.registerPartial(
  "smcat.template.hbs",
  Handlebars.templates["smcat.template.hbs"]
);

function formatActionType(pString) {
  return pString === "activity" ? "" : `${pString}/ `;
}

function flattenActions(pState) {
  const lReturnValue = Object.assign({}, pState);

  lReturnValue.actions = (pState.actions || [])
    .map(pAction => `${formatActionType(pAction.type)}${pAction.body}`)
    .join("\n    ");

  return lReturnValue;
}

/* eslint complexity:0 */
function flagExtendedStateAttributes(pState) {
  if (
    pState.hasOwnProperty("label") ||
    (pState.hasOwnProperty("type") &&
      pState.hasOwnProperty("typeExplicitlySet")) ||
    pState.hasOwnProperty("color") ||
    pState.hasOwnProperty("active")
  ) {
    pState.hasExtendedAttributes = true;
  }
  return pState;
}

function transformStates(pStates, pDirection) {
  pStates
    .map(flagExtendedStateAttributes)
    .filter(pState => pState.statemachine)
    .forEach(pState => {
      pState.statemachine.states = transformStates(
        pState.statemachine.states,
        pDirection
      );
    });

  return pStates.map(flattenActions);
}

function flagExtendedTransitionAttributes(pTransition) {
  if (
    pTransition.hasOwnProperty("type") ||
    pTransition.hasOwnProperty("color")
  ) {
    pTransition.hasExtendedAttributes = true;
  }
  return pTransition;
}

function transformTransitions(pTransitions) {
  return pTransitions.map(flagExtendedTransitionAttributes);
}

Handlebars.registerHelper("quotifyState", pItem =>
  quoteIfNecessary(NAME_QUOTABLE, pItem)
);

Handlebars.registerHelper("quotifyLabel", pItem =>
  quoteIfNecessary(LABEL_QUOTABLE, pItem)
);

Handlebars.registerHelper("quotifyActions", pItem =>
  quoteIfNecessary(ACTIONS_QUOTABLE, pItem)
);

module.exports = pAST =>
  Handlebars.templates["smcat.template.hbs"](
    Object.assign({}, pAST, {
      states: transformStates(_clonedeep(pAST.states)),
      transitions: transformTransitions(_clonedeep(pAST.transitions || []))
    })
  );
