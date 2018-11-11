const Handlebars = require("handlebars/dist/handlebars.runtime");
const ast2Matrix = require("./ast2Matrix");

/* eslint import/no-unassigned-import: 0 */
require("./html.template");

function labelArrayToString(pArray){
    return pArray.join(", ");
}

function prependStateName(pStates){
    return function (pArray, pIndex){
        return {
            rowname: pStates[pIndex].label || pStates[pIndex].name,
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
            values: pAST.states.map((pState) => pState.label || pState.name)
        },
        rows: ast2Matrix.renderLabels(pAST).map(prependStateName(pAST.states))
    };
}

module.exports = (pAST) => Handlebars.templates['html.template.hbs'](toTableMatrix(pAST));

/* eslint new-cap:0 */
