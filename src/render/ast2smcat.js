/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";
    // var Handlebars = require("./lib/handlebars/runtime");
    var Handlebars = require("../lib/handlebars.runtime");
    require("./smcat.template");

    var NAME_QUOTABLE       = new RegExp(";|,|{| ");
    var ACTIVITIES_QUOTABLE = new RegExp(";|,|{");
    var LABEL_QUOTABLE      = new RegExp(";|{");

    function quote(pString) {
        return '"' + pString + '"';
    }

    function quoteIfNecessary(pRegExp, pString){
        return pRegExp.test(pString) ? quote(pString) : pString;
    }

    Handlebars.registerPartial(
        'smcat.template.hbs',
        Handlebars.templates['smcat.template.hbs']
    );

    Handlebars.registerHelper('quotifyState', function(pItem){
        return quoteIfNecessary(NAME_QUOTABLE, pItem);
    });

    Handlebars.registerHelper('quotifyLabel', function(pItem){
        return quoteIfNecessary(LABEL_QUOTABLE, pItem);
    });

    Handlebars.registerHelper('quotifyActivities', function(pItem){
        return quoteIfNecessary(ACTIVITIES_QUOTABLE, pItem);
    });

    return {
        render: function(pAST) {
            return Handlebars.templates['smcat.template.hbs'](pAST);
        }
    };
});
/*
 This file is part of smcat.

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
