const Handlebars = require("handlebars/dist/handlebars.runtime");
const _          = require("./utl");
const ast2Matrix = require("./ast2Matrix");

/* eslint import/no-unassigned-import: 0 */
require("./HTMLTable.template");

function labelArrayToString(pArray){
    return pArray.join(", ");
}

function prependStateName(pStates){
    return function (pArray, pIndex){
        return {
            rowname: pStates[pIndex].name,
            values: pArray.map(labelArrayToString)
        };
    };
}

/**
 * transforms the given AST in to a states x states table
 *
 * for this statemachine
 *   stateA => stateB;
 *   stateB => stateC;
 *   stateB => stateA;
 *   stateC => stateA;
 * it would return
 * {
 * header: {rowname: "", values: ["stateA", "stateB", "stateC"]}
 * rows : [
 *          {rowname: "StateA", values: [false, true, false]},
 *          {rowname: "StateB", values: [true, true, false]},
 *          {rowname: "StateC", values: [true, true, false]},
 *        ]
 * }
 *
 * @param  {[type]} pAST [description]
 * @return {[type]}      [description]
 */
function toTableMatrix(pAST) {
    return {
        header: {
            rowname: "",
            values: pAST.states.map(_.pluck("name"))
        },
        rows: ast2Matrix.renderLabels(pAST).map(prependStateName(pAST.states))
    };
}

module.exports = {
    render (pAST) {
        return Handlebars.templates['HTMLTable.template.hbs'](toTableMatrix(pAST));
    }
};
/* eslint new-cap:0 */
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
