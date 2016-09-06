/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";

    var utl      = require("./utl");
    var counter  = require("./counter");
    var massage  = require("./astMassage");

    var gCounter = {};

    var INDENT          = "  ";

    var STATE_TPL       =
        INDENT + '"${name}" [label="{${name}${activities}}"]';

    var INIT_STATE_TPL  =
        INDENT + '"${name}" [shape=circle style=filled ' +
        'fillcolor=black fixedsize=true height=0.15 label=""]';

    var FINAL_STATE_TPL =
        INDENT + '"${name}" [shape=circle style=filled ' +
        'fillcolor=black fixedsize=true height=0.15 peripheries=2 label=""]';

    var NOTE_TPL        =
        INDENT + '"${name}" [label="${label}" shape=note fontsize=10 fillcolor="#ffffcc" penwidth=1.0]\n';

    var INVIS_NODE_TPL  =
        INDENT + '"${name}" [shape=point style=invis margin=0 width=0 height=0]\n';

    var NOTE_EDGE_TPL   =
        INDENT + '"${from}" -- "${to}" [style=dashed arrowtail=none arrowhead=none]\n';

    var EDGE_NOTE_EDGE_TPL   =
        INDENT + '"${from}" -- "${to}" [style=dashed arrowtail=none arrowhead=none weight=0]\n';

    var EDGE_TPL        =
        INDENT + '"${from}" -- "${to}" [label="${label}"]\n';

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

    function renderState(pState) {
        return (typeToStateTPL(pState.type))
                .replace(/\${name}/g, pState.name)
                .replace(/\${activities}/g, pState.activities ? "|" + pState.activities : "");
    }

    function renderNoteEdge(pFrom, pTo) {
        return NOTE_EDGE_TPL
                .replace("${from}", pFrom)
                .replace("${to}", pTo);
    }

    function renderEdgeNoteEdge(pFrom, pTo) {
        return EDGE_NOTE_EDGE_TPL
                .replace("${from}", pFrom)
                .replace("${to}", pTo);
    }

    function renderNote(pName, pLabel) {
        return NOTE_TPL
                .replace("${name}", pName)
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
        return pStates.filter(massage.hasNote).map(renderStateNote).join("\n").concat("\n\n");
    }

    function renderStates(pStates) {
        return pStates
            .map(renderState)
            .join("\n")
            .concat("\n")
            .concat(renderStateNotes(pStates));
    }

    function renderInvisibleNode(pTrans) {
        return INVIS_NODE_TPL.replace("${name}", pTrans.name);
    }

    function notedTransitionToString(pTrans) {
        return renderInvisibleNode(pTrans) +
                INDENT + '"${from}" -- "${to}" [arrowhead=none]\n'
                .replace(/\${from}/g, pTrans.from)
                .replace(/\${to}/g, pTrans.name) +
               renderEdge(pTrans.name, pTrans.to, pTrans.label);
    }

    function renderTransitionNote(pTrans) {
        return renderNote(pTrans.noteName, pTrans.note) +
                renderEdgeNoteEdge(pTrans.name, pTrans.noteName);
    }

    function renderTransitionNotes(pTransitions) {
        return pTransitions
                .filter(massage.hasNote)
                .map(renderTransitionNote)
                .join("");
    }

    function transitionToString(pTrans) {
        if (Boolean(pTrans.note)) {
            return notedTransitionToString(pTrans);
        }
        return renderEdge(pTrans.from, pTrans.to, pTrans.label);

    }

    function renderTransitions(pTransitions) {
        return pTransitions
                .map(transitionToString)
                .join("")
                .concat(renderTransitionNotes(pTransitions));
    }

    function renderGraph(pStates, pTransitions) {
        return [
            'graph "state transitions" {',
            INDENT + 'splines=true ordering=out fontname="Helvetica" fontsize=12 overlap=true',
            INDENT + 'node [shape=Mrecord style=filled fillcolor=white fontname=Helvetica fontsize=12 penwidth=2.0]',
            INDENT + 'edge [fontname=Helvetica fontsize=10 arrowhead=normal dir=forward]',
            '\n${states}',
            '${transitions}',
            '}'
        ]
        .join("\n")
        .replace(/\${states}/g, pStates)
        .replace(/\${transitions}/g, pTransitions);
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

    function nameNote(pState) {
        if (pState.note) {
            pState.noteName = "note_" + pState.name;
        }
        return pState;
    }

    function escapeString (pString){
        return pString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    function escapeStrings(pThing) {
        if (pThing.note) {
            pThing.note =
                pThing.note.map(escapeString)
                .join("\\l")
                .concat("\\l");
        }
        if (pThing.label) {
            pThing.label = escapeString(pThing.label);
        }
        if (pThing.activities) {
            pThing.activities = escapeString(pThing.activities);
        }
        return pThing;
    }

    return {
        render: function (pAST) {
            var lAST = utl.clone(pAST);
            gCounter = new counter.Counter();

            return renderGraph(
                renderStates(lAST.states.map(nameNote).map(escapeStrings)),
                lAST.transitions
                    ? renderTransitions(
                        lAST.transitions
                            .concat(massage.explode(lAST.transitions, lAST.states))
                            .filter(massage.isTransitionType(["regular"]))
                            .map(nameTransition)
                            .map(escapeStrings)
                    )
                    : ""
            );
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
