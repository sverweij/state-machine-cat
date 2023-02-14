"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Handlebars = require("handlebars/dist/handlebars.runtime.js");
const cloneDeep = require("lodash/cloneDeep.js");
require("./smcat.template.js");
const NAME_QUOTABLE = /;|,|{| |\[/;
const ACTIONS_QUOTABLE = /;|,|{/;
const LABEL_QUOTABLE = /;|{/;
function quoteIfNecessary(pRegExp, pString) {
    return pRegExp.test(pString) ? `"${pString}"` : pString;
}
Handlebars.registerPartial("smcat.template.hbs", Handlebars.templates["smcat.template.hbs"]);
function formatActionType(pString) {
    return pString === "activity" ? "" : `${pString}/ `;
}
function flattenActions(pState) {
    return {
        ...pState,
        actions: (pState.actions || [])
            .map((pAction) => `${formatActionType(pAction.type)}${pAction.body}`)
            .join("\n    "),
    };
}
function flagExtendedStateAttributes(pState) {
    if (Object.prototype.hasOwnProperty.call(pState, "label") ||
        Object.prototype.hasOwnProperty.call(pState, "typeExplicitlySet") ||
        Object.prototype.hasOwnProperty.call(pState, "color") ||
        Object.prototype.hasOwnProperty.call(pState, "active") ||
        Object.prototype.hasOwnProperty.call(pState, "class")) {
        pState.hasExtendedAttributes = true;
    }
    return pState;
}
function transformStates(pStates) {
    pStates
        .map(flagExtendedStateAttributes)
        .filter((pState) => pState.statemachine)
        .forEach((pState) => {
        pState.statemachine.states = transformStates(pState.statemachine.states);
    });
    return pStates.map(flattenActions);
}
function flagExtendedTransitionAttributes(pTransition) {
    if (Object.prototype.hasOwnProperty.call(pTransition, "type") ||
        Object.prototype.hasOwnProperty.call(pTransition, "color") ||
        Object.prototype.hasOwnProperty.call(pTransition, "class")) {
        pTransition.hasExtendedAttributes = true;
    }
    return pTransition;
}
function transformTransitions(pTransitions) {
    return pTransitions.map(flagExtendedTransitionAttributes);
}
Handlebars.registerHelper("quotifyState", (pItem) => quoteIfNecessary(NAME_QUOTABLE, pItem));
Handlebars.registerHelper("quotifyLabel", (pItem) => quoteIfNecessary(LABEL_QUOTABLE, pItem));
Handlebars.registerHelper("quotifyActions", (pItem) => quoteIfNecessary(ACTIONS_QUOTABLE, pItem));
module.exports = function renderSmcat(pStateMachine) {
    return Handlebars.templates["smcat.template.hbs"]({
        ...pStateMachine,
        states: transformStates(cloneDeep(pStateMachine.states)),
        transitions: transformTransitions(cloneDeep(pStateMachine.transitions || [])),
    });
};
