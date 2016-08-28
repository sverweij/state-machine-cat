/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";

    var INDENT          = "  ";
    var COUNTER         = 0;

    var STATE_TPL       = INDENT +
                            '"${name}" [label="{${name}${activities}}"]';
    var INIT_STATE_TPL  = INDENT +
                            '"${name}" [shape=circle style=filled fillcolor=black fixedsize=true height=0.15 label=""]';
    var FINAL_STATE_TPL = INDENT +
                            '"${name}" [shape=circle style=filled fillcolor=black fixedsize=true height=0.15 peripheries=2 label=""]';
    var NOTE_TPL        = INDENT + '"${name}" [label="${label}" shape=note fontsize=10]\n';
    var INVIS_NODE_TPL  = INDENT + '"${name}" [shape=point style=invis margin=0 width=0 height=0]\n';
    var NOTE_EDGE_TPL   = INDENT +
                            '"${from}" -- "${to}" [style=dashed arrowtail=none arrowhead=none]\n';
    var EDGE_TPL        = INDENT + '"${from}" -- "${to}" [label="${label}"]\n';


    function typeToStateTPL(pType) {
        switch (pType) {
        case "initial":
            return INIT_STATE_TPL;
        case "final":
            return FINAL_STATE_TPL;
        default:
            return STATE_TPL;
        }
    }

    function stateToString(pState) {
        return (typeToStateTPL(pState.type))
                .replace(/\${name}/g, pState.name)
                .replace(/\${activities}/g, pState.activities ? "|" + pState.activities : "");
    }

    function hasNote(pState) {
        return Boolean(pState.note);
    }

    function renderNoteEdge(pFrom, pTo) {
        return NOTE_EDGE_TPL
                .replace("${from}", pFrom)
                .replace("${to}", pTo);
    }

    function renderNote(pName, pLabel) {
        return NOTE_TPL.replace("${name}", pName)
                .replace("${label}", pLabel);
    }

    function renderEdge(pFrom, pTo, pLabel) {
        return EDGE_TPL
                .replace("${from}", pFrom)
                .replace("${to}", pTo)
                .replace("${label}", pLabel || "");
    }

    function renderStateNote(pState) {
        return renderNote(pState.noteName, pState.note) +
                renderNoteEdge(pState.name, pState.noteName);

    }
    function renderStateNotes(pStates) {
        return pStates.filter(hasNote).map(renderStateNote).join("\n").concat("\n\n");
    }

    function renderStates(pStates) {
        return pStates
            .map(stateToString)
            .join("\n")
            .concat(renderStateNotes(pStates));
    }

    function quote(pString) {
        return '"' + pString + '"';
    }

    function renderInvisibleNode(pTrans) {
        return INVIS_NODE_TPL.replace("${name}", pTrans.name);
    }

    function notedTransitionToString(pTrans) {
        return renderInvisibleNode(pTrans) +
               INDENT + quote(pTrans.from) + " -- " + quote(pTrans.name) + "[arrowhead=none]\n" +
               renderEdge(pTrans.name, pTrans.to, pTrans.label);
    }


    function renderTransitionNote(pTrans) {
        return renderNote(pTrans.noteName, pTrans.note) +
                renderNoteEdge(pTrans.name, pTrans.noteName);
    }

    function renderTransitionNotes(pTransitions) {
        return pTransitions
                .filter(hasNote)
                .map(renderTransitionNote)
                .join("")
                .concat("\n");
    }

    function transitionToString(pTrans) {
        if (Boolean(pTrans.note)) {
            return notedTransitionToString(pTrans);
        }
        return renderEdge(pTrans.from, pTrans.to, pTrans.label);

    }

    function renderTransitions(pTransitions) {
        if (pTransitions) {
            return pTransitions
                    .map(transitionToString)
                    .join("")
                    .concat(renderTransitionNotes(pTransitions));
        }

        return "";
    }

    function renderPrelude() {
        return ['graph {',
                //   INDENT + 'rankdir=LR',
                  INDENT + 'splines=true',
                  INDENT + 'ordering=out',
                  INDENT + 'fontname="Helvetica"',
                  INDENT + 'fontsize=12',
                  INDENT + 'node [shape=Mrecord style=filled fillcolor=white fontname=Helvetica fontsize=12 ]',
                  INDENT + 'edge [fontname=Helvetica fontsize=10 arrowhead=normal dir=forward]'
              ]
              .join("\n")
              .concat("\n\n");
    }
    function clone(pObject) {
        return JSON.parse(JSON.stringify(pObject));
    }

    function getNumber() {
        return (++COUNTER).toString(10);
    }

    function nameTransition(pTrans) {
        pTrans.name =
            "tr_" + pTrans.from + "_" + pTrans.to + "_" + getNumber(pTrans);
        if (Boolean(pTrans.note)){
            pTrans.noteName = "note_" + pTrans.name;
        }

        return pTrans;
    }

    function nameNote(pState) {
        if (pState.note) {
            pState.noteName = "note_" + pState.name;
        }
        return pState;
    }

    function render(pAST) {
        var lAST = clone(pAST);

        return renderPrelude() +
               renderStates(lAST.states.map(nameNote)) +
               renderTransitions(lAST.transitions.map(nameTransition)) +
               "}";
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
