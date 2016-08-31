/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";

    var NAME_QUOTABLE       = new RegExp(";|,|{| ");
    var ACTIVITIES_QUOTABLE = new RegExp(";|,|{");
    var LABEL_QUOTABLE      = new RegExp(";|{");

    function renderIfThere(pThing, pBefore) {
        if (Boolean(pThing)){
            return pBefore + pThing;
        }
        return "";
    }

    function renderNote(pNote) {
        if (Boolean(pNote)){
            return pNote
                .split("\n")
                .map(function(pNotePart){
                    return "# " + pNotePart + "\n";
                }).join("");
        }
        return "";
    }

    function stateToString(pState) {
        return renderNote(pState.note) +
                pState.name +
                renderIfThere(pState.activities, ": ") + "${closer}";
    }

    function renderStates(pStates) {
        return pStates
            .map(stateToString)
            .reduce((sum, elt, i) => {
                return sum +
                        elt.replace(
                            /\${closer}/g,
                            i < (pStates.length - 1) ? "," : ";"
                        ) +
                        "\n";
            }, "");
    }

    function transitionToString(pTransition) {
        return renderNote(pTransition.note) +
                pTransition.from + " => " + pTransition.to +
                renderIfThere(pTransition.label, ": ") + ";";
    }

    function renderTransitions(pTransitions) {
        return pTransitions
                .map(transitionToString)
                .join("\n");
    }

    function quote(pString) {
        return "\"" + pString + "\"";
    }

    function quoteIfNecessary(pRegExp, pString){
        return pRegExp.test(pString) ? quote(pString) : pString;
    }

    function clone(pObject) {
        return JSON.parse(JSON.stringify(pObject));
    }

    function quotifyState(pState){
        var lState = clone(pState);
        lState.name = quoteIfNecessary(NAME_QUOTABLE, pState.name);
        if (Boolean(lState.activities)) {
            lState.activities = quoteIfNecessary(ACTIVITIES_QUOTABLE, pState.activities);
        }
        return lState;
    }

    function quotifyTransition(pTransition) {
        var lTransition = clone(pTransition);
        lTransition.from  = quoteIfNecessary(NAME_QUOTABLE, pTransition.from);
        lTransition.to    = quoteIfNecessary(NAME_QUOTABLE, pTransition.to);
        if (Boolean(pTransition.label)) {
            lTransition.label = quoteIfNecessary(LABEL_QUOTABLE, pTransition.label);
        }

        return lTransition;
    }

    return {
        render: function(pAST) {
            return renderStates(pAST.states.map(quotifyState)) +
                    (Boolean(pAST.transitions)
                        ? renderTransitions(
                            pAST.transitions.map(quotifyTransition)
                        )
                        : "");
        }
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
