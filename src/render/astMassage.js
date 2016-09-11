/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";

    function isType(pString){
        return function (pState){
            return pState.type === pString;
        };
    }

    function has(pString){
        return function (pState){
            return pState.hasOwnProperty(pString);
        };
    }

    function extractTransitions(pStateMachine) {
        var lTransitions = [];

        if (pStateMachine.hasOwnProperty("transitions")) {
            lTransitions = pStateMachine.transitions;
        }
        if (pStateMachine.hasOwnProperty("states")) {
            pStateMachine.states
            .filter(isType("composite"))
            .filter(has("statemachine"))
            .forEach(function(pState){
                lTransitions = lTransitions.concat(
                    extractTransitions(pState.statemachine)
                );
            });
        }
        return lTransitions;
    }
    return {
        extractTransitions: extractTransitions,
        isType: isType
    };
});
/*
 This file is part of stategenny.

 stategenny is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 stategenny is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with stategenny.  If not, see <http://www.gnu.org/licenses/>.
 */
