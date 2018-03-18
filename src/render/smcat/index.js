const Handlebars = require("handlebars/dist/handlebars.runtime");

/* eslint import/no-unassigned-import: 0 */
require("./smcat.template");

const NAME_QUOTABLE       = new RegExp(";|,|{| ");
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

/*
 This file is part of state-machine-cat.

 smcat is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 smcat is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with smcat.  If not, see <http://www.gnu.org/licenses/>.
 */
