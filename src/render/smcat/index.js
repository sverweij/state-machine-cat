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

Handlebars.registerHelper('quotifyState', (pItem) => quoteIfNecessary(NAME_QUOTABLE, pItem));

Handlebars.registerHelper('quotifyLabel', (pItem) => quoteIfNecessary(LABEL_QUOTABLE, pItem));

Handlebars.registerHelper('quotifyActivities', (pItem) => quoteIfNecessary(ACTIVITIES_QUOTABLE, pItem));

module.exports = (pAST) => Handlebars.templates['smcat.template.hbs'](pAST);
