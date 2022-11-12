// @ts-check
/** @type {any} - the type definitions for Handlebars don't match what we're actually using - hence this override*/
const Handlebars = require("handlebars/dist/handlebars.runtime.js");
const cloneDeep = require("lodash/cloneDeep.js");

// eslint-disable-next-line import/no-unassigned-import
require("./smcat.template.js");

/**
 * @typedef {{hasExtendedAttributes?: boolean} & import("../../../types/state-machine-cat.js").IState} IExtendedState
 * @typedef {{actions: string;} & Omit<IExtendedState, "actions">} IFlattenedActionsState
 */

const NAME_QUOTABLE = /;|,|{| |\[/;
const ACTIONS_QUOTABLE = /;|,|{/;
const LABEL_QUOTABLE = /;|{/;

/**
 * @param {RegExp} pRegExp
 * @param {string} pString
 * @returns {string}
 */
function quoteIfNecessary(pRegExp, pString) {
  return pRegExp.test(pString) ? `"${pString}"` : pString;
}

Handlebars.registerPartial(
  "smcat.template.hbs",
  Handlebars.templates["smcat.template.hbs"]
);

/**
 * @param {string} pString
 * @returns {string}
 */
function formatActionType(pString) {
  return pString === "activity" ? "" : `${pString}/ `;
}

/**
 * @param {IExtendedState} pState
 * @returns {IFlattenedActionsState}
 */
function flattenActions(pState) {
  return {
    ...pState,
    actions: (pState.actions || [])
      .map((pAction) => `${formatActionType(pAction.type)}${pAction.body}`)
      .join("\n    "),
  };
}

/**
 * @param {IExtendedState} pState
 * @returns {IExtendedState}
 */
/* eslint complexity:0 */
function flagExtendedStateAttributes(pState) {
  if (
    Object.prototype.hasOwnProperty.call(pState, "label") ||
    Object.prototype.hasOwnProperty.call(pState, "typeExplicitlySet") ||
    Object.prototype.hasOwnProperty.call(pState, "color") ||
    Object.prototype.hasOwnProperty.call(pState, "active") ||
    Object.prototype.hasOwnProperty.call(pState, "class")
  ) {
    // note & fixme: mutating a parameter here
    pState.hasExtendedAttributes = true;
  }
  return pState;
}

/**
 * @param {import("../../../types/state-machine-cat.js").IState[]} pStates
 * @returns {IFlattenedActionsState[]}
 */
function transformStates(pStates) {
  pStates
    .map(flagExtendedStateAttributes)
    .filter((pState) => pState.statemachine)
    .forEach((pState) => {
      // @ts-expect-error because of the filter above the statemachine is
      // sure to exist, although TS currently doesn't detect this.
      // also fixme: mutating a parameter here
      pState.statemachine.states = transformStates(
        // @ts-expect-error - see above
        pState.statemachine.states
      );
    });

  return pStates.map(flattenActions);
}

function flagExtendedTransitionAttributes(pTransition) {
  if (
    Object.prototype.hasOwnProperty.call(pTransition, "type") ||
    Object.prototype.hasOwnProperty.call(pTransition, "color") ||
    Object.prototype.hasOwnProperty.call(pTransition, "class")
  ) {
    pTransition.hasExtendedAttributes = true;
  }
  return pTransition;
}

function transformTransitions(pTransitions) {
  return pTransitions.map(flagExtendedTransitionAttributes);
}

Handlebars.registerHelper("quotifyState", (pItem) =>
  quoteIfNecessary(NAME_QUOTABLE, pItem)
);

Handlebars.registerHelper("quotifyLabel", (pItem) =>
  quoteIfNecessary(LABEL_QUOTABLE, pItem)
);

Handlebars.registerHelper("quotifyActions", (pItem) =>
  quoteIfNecessary(ACTIONS_QUOTABLE, pItem)
);

/** @type {import("../../../types/state-machine-cat.js").StringRenderFunctionType} */
module.exports = function renderSmcat(pStateMachine) {
  return Handlebars.templates["smcat.template.hbs"]({
    ...pStateMachine,
    states: transformStates(cloneDeep(pStateMachine.states)),
    transitions: transformTransitions(
      cloneDeep(pStateMachine.transitions || [])
    ),
  });
};
