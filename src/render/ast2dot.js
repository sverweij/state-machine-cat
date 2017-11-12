/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";

    var _          = require("./utl");
    var counter    = require("./counter");
    var astMassage = require("./astMassage");
    var Handlebars = require("../lib/handlebars.runtime");
    require("./dot.template");
    require("./dot.states.template");

    var gCounter = {};

    Handlebars.registerPartial(
        'dot.states.template.hbs',
        Handlebars.templates['dot.states.template.hbs']
    );

    Handlebars.registerHelper(
        'stateSection',
        function (pStateMachine) {
            return Handlebars.templates['dot.states.template.hbs'](splitStates(pStateMachine));
        }
    );

    function nameNote(pState) {
        if (pState.hasOwnProperty("note")) {
            pState.noteName = "note_" + pState.name;
        }
        return pState;
    }

    function flattenNote(pState) {
        if (pState.hasOwnProperty("note")) {
            pState.noteFlattened = pState.note.join("");
        }
        return pState;
    }

    function escapeString (pString){
        return pString
            .replace(/\\/g, '\\\\')
            .replace(/\n\s*/g, '\\l')
            .replace(/"/g, '\\"')
            .concat('\\l');
    }

    function escapeLabelString (pString){
        return pString
            .replace(/\\/g, '\\\\')
            .replace(/\n\s*/g, '   \\l')
            .replace(/"/g, '\\"')
            .concat('   \\l');
    }

    function escapeStrings(pThing) {
        if (pThing.note) {
            pThing.note = pThing.note.map(escapeString);
        }
        if (pThing.label) {
            pThing.label = escapeLabelString(pThing.label);
        }
        if (pThing.activities) {
            pThing.activities = escapeString(pThing.activities);
        }
        return pThing;
    }

    function setLabel(pDirection) {
        return function (pState) {
            var lRetval = Object.assign({}, pState);

            lRetval.label = pState.name;
            if (pState.activities) {
                lRetval.label += "|" + pState.activities;
            }
            if (pDirection !== 'left-right') {
                lRetval.label = "{" + lRetval.label + "}";
            }
            return lRetval;
        };
    }

    function tipForkJoinStates(pDirection) {
        return function (pState) {
            if (_.isType("forkjoin")(pState)){
                return Object.assign(
                    {
                        sizingExtras: (pDirection || "top-down") === "top-down" ? "height=0.1" : "width=0.1"
                    },
                    pState
                );
            } else {
                return pState;
            }
        };
    }

    function transformStates(pStates, pDirection) {
        pStates
            .filter(_.isType("composite"))
            .forEach(function(pState){
                pState.statemachine.states = transformStates(pState.statemachine.states, pDirection);
            });

        return pStates
            .map(nameNote)
            .map(escapeStrings)
            .map(flattenNote)
            .map(setLabel(pDirection))
            .map(tipForkJoinStates(pDirection));
    }

    function transformStatesFromAnAST(pAST, pDirection) {
        pAST.states = transformStates(pAST.states, pDirection);
        return pAST;
    }

    function splitStates(pAST) {
        pAST.initialStates   = pAST.states.filter(_.isType("initial"));
        pAST.regularStates   = pAST.states.filter(_.isType("regular"));
        pAST.choiceStates    = pAST.states.filter(_.isType("choice"));
        pAST.forkjoinStates  = pAST.states.filter(_.isType("forkjoin"));
        pAST.finalStates     = pAST.states.filter(_.isType("final"));
        pAST.compositeStates = pAST.states.filter(_.isType("composite"));

        return pAST;
    }

    function addEndTypes(pStates) {
        return function (pTransition){
            if (astMassage.findStateByName(pTransition.from)(pStates).type === "composite"){
                pTransition.fromComposite = true;
            }
            if (astMassage.findStateByName(pTransition.to)(pStates).type === "composite"){
                pTransition.toComposite = true;
            }

            return pTransition;
        };
    }

    function transformTransitions(pAST) {
        var lFlattenedStates = astMassage.flattenStates(pAST.states);

        pAST.transitions =
            pAST.transitions
                .map(nameTransition)
                .map(escapeStrings)
                .map(flattenNote)
                .map(addEndTypes(lFlattenedStates));

        return pAST;
    }

    function nameTransition(pTrans) {
        pTrans.name = "tr_${from}_${to}_${counter}"
            .replace(/\${from}/g, pTrans.from)
            .replace(/\${to}/g, pTrans.to)
            .replace(/\${counter}/g, gCounter.nextAsString());

        if (Boolean(pTrans.note)){
            pTrans.noteName = "note_" + pTrans.name;
        }

        return pTrans;
    }

    return {
        render: function (pAST, pOptions) {
            pOptions = pOptions || {};
            gCounter = new counter.Counter();
            var lAST =
                transformTransitions(
                    astMassage.flattenTransitions(
                        splitStates(
                            transformStatesFromAnAST(_.clone(pAST), pOptions.direction)
                        )
                    )
                );
            if (pOptions.direction === "left-right"){
                lAST.direction = "LR";
            }

            return Handlebars.templates['dot.template.hbs'](lAST);
        }
    };
});
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
