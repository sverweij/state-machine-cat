/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";

    var utl = require("./utl");

    function isTransitionType(pTypes) {
        return function (pTransition) {
            return pTypes.some(
                pType => pTransition.type && (pType === pTransition.type)
            );
        };
    }

    function doMagic(pTransition) {
        return function(pState){
            var lTransition = utl.clone(pTransition);

            if (lTransition.type === "broadcast_out"){
                lTransition.to = pState.name;
            } else {
                lTransition.from = pState.name;
            }
            lTransition.type = "regular";

            return lTransition;
        };
    }

    function stateNotInTransition(pTransition) {
        return function(pState){
            return pState.name !== pTransition.from &&
                    pState.name !== pTransition.to;
        };
    }

    function explode(pTransitions, pStates) {
        return pTransitions
                .filter(isTransitionType(["broadcast_out", "broadcast_in"]))
                .reduce(
                    (pAll, pTransition) => {
                        return pAll.concat(
                            pStates
                                .filter(stateNotInTransition(pTransition))
                                .map(doMagic(pTransition))
                        );
                    },
                    []
                );
    }

    return {
        isTransitionType: isTransitionType,
        explode: explode,

        hasNote: function(pState) {
            return Boolean(pState.note);
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
