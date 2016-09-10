/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";

    var utl      = require("./utl");
    var counter  = require("./counter");
    var Handlebars = require("../lib/handlebars.runtime");
    require("./dot.template");

    var gCounter = {};

    function nameNote(pState) {
        if (pState.hasOwnProperty("note")) {
            pState.noteName = "note_" + pState.name;
        }
        return pState;
    }
    function flattenNote(pState) {
        if (pState.hasOwnProperty("note")) {
            pState.noteFlattened = pState.note.join("\\l").concat("\\l");
        }
        return pState;
    }

    function isType(pString){
        return function (pState){
            return pState.type === pString;
        };
    }

    function escapeString (pString){
        return pString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    function escapeStrings(pThing) {
        if (pThing.note) {
            pThing.note = pThing.note.map(escapeString);
        }
        if (pThing.label) {
            pThing.label = escapeString(pThing.label);
        }
        if (pThing.activities) {
            pThing.activities = escapeString(pThing.activities);
        }
        return pThing;
    }

    function nameThings(pAST) {
        pAST.states =
            pAST.states
            .map(nameNote)
            .map(escapeStrings)
            .map(flattenNote);

        pAST.initialStates   = pAST.states.filter(isType("initial"));
        pAST.regularStates   = pAST.states.filter(isType("regular"));
        pAST.finalStates     = pAST.states.filter(isType("final"));
        pAST.compositeStates = pAST.states.filter(isType("composite"));

        if (pAST.hasOwnProperty("transitions")) {
            pAST.transitions     =
                pAST.transitions
                .map(nameTransition)
                .map(escapeStrings)
                .map(flattenNote);
        }
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
        render: function (pAST) {
            gCounter = new counter.Counter();
            var lAST = nameThings(utl.clone(pAST));

            return Handlebars.templates['dot.template.hbs'](lAST);
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
