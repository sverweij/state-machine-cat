/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";
    var _ = require("./utl");

    function isTransitionFromTo(pFromStateName, pToStateName){
        return function (pTransition){
            return (pTransition.from === pFromStateName) &&
                    (pTransition.to === pToStateName);
        };
    }

    function getCount(pTransitions) {
        return pTransitions.length;
    }

    function getLabels(pTransitions) {
        return pTransitions.filter(_.has("label")).map(_.pluck("label"));
    }

    function getTos(pAST, pTransitionSummaryFn) {
        return function(pFromState){
            return pAST.states.map(function(pToState){
                return pTransitionSummaryFn(
                    pAST.hasOwnProperty("transitions")
                    ? pAST.transitions.filter(
                        isTransitionFromTo(
                            pFromState.name,
                            pToState.name
                        )
                    )
                    : []
                );
            });
        };
    }

    return {
        /**
         * transforms the given AST in to a states x states table
         *
         * for this statemachine
         *   stateA => stateB;
         *   stateB => stateC;
         *   stateB => stateA;
         *   stateC => stateA: one way;
         *   stateC => stateA: another;
         * it would return
         *
         * [
         *    [0, 1, 0],
         *    [1, 0, 1],
         *    [2, 0, 0],
         * ]
         *
         * @param  {object} pAST abstract syntax tree of an smcat
         * @return {array} a 2 dimensional array of booleans
         */
        renderCounts: function (pAST) {
            return pAST.states.map(getTos(pAST, getCount));
        },

        /**
         * Same as renderCounts, but instead of a count returns an array
         * of the labels of the transitions
         * @param  {[type]} pAST [description]
         * @return {[type]}      [description]
         */
        renderLabels: function (pAST) {
            return pAST.states.map(getTos(pAST, getLabels));
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
