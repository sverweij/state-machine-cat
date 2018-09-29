const Handlebars = require("handlebars/dist/handlebars.runtime");

/* eslint import/no-unassigned-import: 0 */
require("./smcat.template");

const NAME_QUOTABLE       = new RegExp(";|,|{| |\\[");
const ACTIVITIES_QUOTABLE = new RegExp(";|,|{");
const LABEL_QUOTABLE      = new RegExp(";|{");

function quoteIfNecessary(pRegExp, pString){
    return pRegExp.test(pString) ? `"${pString}"` : pString;
}

Handlebars.registerPartial(
    'smcat.template.hbs',
    Handlebars.templates['smcat.template.hbs']
);
function extractTriggersOfType (pTriggers, pType){
    return (pTriggers || [])
        .filter((pTrigger) => pTrigger.type === pType)
        .map((pTrigger) => `${pTrigger.type}/ ${pTrigger.body}`)
    ;
}
function addTriggersToActivities(pState) {
    const lRetval = Object.assign({}, pState);

    lRetval.activities = extractTriggersOfType(pState.triggers, 'entry')
        .concat(lRetval.activities || [])
        .concat(extractTriggersOfType(pState.triggers, 'exit'))
        .join('\n    ')
    ;

    return lRetval;
}

Handlebars.registerHelper('quotifyState', (pItem) => quoteIfNecessary(NAME_QUOTABLE, pItem));

Handlebars.registerHelper('quotifyLabel', (pItem) => quoteIfNecessary(LABEL_QUOTABLE, pItem));

Handlebars.registerHelper('quotifyActivities', (pItem) => quoteIfNecessary(ACTIVITIES_QUOTABLE, pItem));

module.exports = (pAST) =>
    Handlebars.templates['smcat.template.hbs'](
        Object.assign({}, pAST, {states: pAST.states.map(addTriggersToActivities)})
    );
