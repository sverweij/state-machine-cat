/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";

    function renderIfThere(pThing, pSeparator) {
        return Boolean(pThing) ? pSeparator + pThing : "";
    }

    function stateToString(pState) {
        return pState.name +
                renderIfThere(pState.activities, ": ") + "${closer}" +
                renderIfThere(pState.note, "# ");
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
        return pTransition.from + " => " + pTransition.to +
                renderIfThere(pTransition.label, ": ") + ";" +
                renderIfThere(pTransition.note, "# ");

    }

    function renderTransitions(pTransitions) {
        if (pTransitions) {
            return pTransitions
                    .map(transitionToString)
                    .join("\n");
        }

        return "";
    }

    function render(pAST) {
        return renderStates(pAST.states) + renderTransitions(pAST.transitions);
    }

    return {
        render: render
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
