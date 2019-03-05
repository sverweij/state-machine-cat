const Handlebars = require("handlebars/dist/handlebars.runtime");
const _clonedeep = require("lodash.clonedeep");

/* eslint import/no-unassigned-import: 0 */
require("./smcat.template");

const NAME_QUOTABLE    = new RegExp(";|,|{| |\\[");
const ACTIONS_QUOTABLE = new RegExp(";|,|{");
const LABEL_QUOTABLE   = new RegExp(";|{");

function quoteIfNecessary(pRegExp, pString){
    return pRegExp.test(pString) ? `"${pString}"` : pString;
}

Handlebars.registerPartial(
    'smcat.template.hbs',
    Handlebars.templates['smcat.template.hbs']
);

function formatActionType(pString) {
    return pString === "activity" ? "" : `${pString}/ `;
}

function flattenActions(pState) {
    const lRetval = Object.assign({}, pState);

    lRetval.actions = (pState.actions || [])
        .map((pAction) => `${formatActionType(pAction.type)}${pAction.body}`)
        .join('\n    ')
    ;

    return lRetval;
}

/* eslint complexity:0 */
function flagExtendedAttributes(pState) {
    if (
        pState.hasOwnProperty("label") ||
        pState.hasOwnProperty("type") && pState.hasOwnProperty("typeExplicitlySet") ||
        pState.hasOwnProperty("color") ||
        pState.hasOwnProperty("active")
    ){
        pState.hasExtendedAttributes = true;
    }
    return pState;
}

function transformStates(pStates, pDirection) {
    pStates
        .map(flagExtendedAttributes)
        .filter((pState) => pState.statemachine)
        .forEach((pState) => {
            pState.statemachine.states = transformStates(pState.statemachine.states, pDirection);
        });

    return pStates.map(flattenActions);
}

Handlebars.registerHelper('quotifyState', (pItem) => quoteIfNecessary(NAME_QUOTABLE, pItem));

Handlebars.registerHelper('quotifyLabel', (pItem) => quoteIfNecessary(LABEL_QUOTABLE, pItem));

Handlebars.registerHelper('quotifyActions', (pItem) => quoteIfNecessary(ACTIONS_QUOTABLE, pItem));

module.exports = (pAST) =>
    Handlebars.templates['smcat.template.hbs'](
        Object.assign({}, pAST, {states: transformStates(_clonedeep(pAST.states))})
    );
