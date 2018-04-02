const Handlebars        = require('handlebars/dist/handlebars.runtime');
const _cloneDeep        = require('lodash.clonedeep');
const StateMachineModel = require('../stateMachineModel');
const counter           = require('./counter');

/* eslint import/no-unassigned-import: 0 */
require("./dot.template");
require("./dot.states.template");

let gCounter = {};

Handlebars.registerPartial(
    'dot.states.template.hbs',
    Handlebars.templates['dot.states.template.hbs']
);

Handlebars.registerHelper(
    'stateSection',
    (pStateMachine) => Handlebars.templates['dot.states.template.hbs'](splitStates(pStateMachine))
);

function isType(pString){
    return function (pState){
        return pState.type === pString;
    };
}

function nameNote(pState) {
    if (pState.hasOwnProperty("note")) {
        pState.noteName = `note_${pState.name}`;
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
        const lRetval = Object.assign({}, pState);

        lRetval.label = pState.name;
        if (pState.statemachine) {
            if (pState.activities) {
                /* eslint no-useless-escape: off */
                lRetval.label += `\\n${pState.activities.replace(/\n/g, '\l')}`;
            }
        } else {
            if (pState.activities) {
                lRetval.label += `|${pState.activities}`;
            }
            if (pDirection !== 'left-right') {
                lRetval.label = `{${lRetval.label}}`;
            }
        }

        return lRetval;
    };
}

function tipForkJoinStates(pDirection) {
    return function (pState) {
        if (isType("forkjoin")(pState)){
            return Object.assign(
                {
                    sizingExtras: (pDirection || "top-down") === "top-down" ? "height=0.1" : "width=0.1"
                },
                pState
            );
        }
        return pState;

    };
}

function tagParallelChildren(pState) {
    if (pState.type === "parallel") {
        if (pState.statemachine && pState.statemachine.states) {
            pState.statemachine.states = pState.statemachine.states
                .filter(isType("regular"))
                .map((pChildState) => Object.assign({}, pChildState, {parentIsParallel: true}));
        }
    }

    return pState;
}

function transformStates(pStates, pDirection) {
    pStates
        .filter((pState) => pState.statemachine)
        .forEach((pState) => {
            pState.statemachine.states = transformStates(pState.statemachine.states, pDirection);
        });

    return pStates
        .map(nameNote)
        .map(escapeStrings)
        .map(flattenNote)
        .map(setLabel(pDirection))
        .map(tagParallelChildren)
        .map(tipForkJoinStates(pDirection));
}

function splitStates(pAST) {
    pAST.initialStates     = pAST.states.filter(isType("initial"));
    pAST.regularStates     = pAST.states.filter(
        (pState) => isType("regular")(pState) && !pState.statemachine
    );
    pAST.historyStates     = pAST.states.filter(isType("history"));
    pAST.deepHistoryStates = pAST.states.filter(isType("deephistory"));
    pAST.choiceStates      = pAST.states.filter(isType("choice"));
    pAST.forkjoinStates    = pAST.states.filter(isType("forkjoin"));
    pAST.finalStates       = pAST.states.filter(isType("final"));
    pAST.compositeStates =   pAST.states.filter((pState) => pState.statemachine);

    return pAST;
}

function addEndTypes(pStateMachineModel) {
    return function (pTransition){
        if (pStateMachineModel.findStateByName(pTransition.from).statemachine){
            pTransition.fromComposite = true;
        }
        if (pStateMachineModel.findStateByName(pTransition.to).statemachine){
            pTransition.toComposite = true;
        }

        return pTransition;
    };
}

function transformTransitions(pStateMachineModel) {
    const lTransitions =
        pStateMachineModel
            .flattenedTransitions
            .map(nameTransition)
            .map(escapeStrings)
            .map(flattenNote)
            .map(addEndTypes(pStateMachineModel));

    return lTransitions;
}

function nameTransition(pTrans) {
    pTrans.name = "tr_${from}_${to}_${counter}"
        .replace(/\${from}/g, pTrans.from)
        .replace(/\${to}/g, pTrans.to)
        .replace(/\${counter}/g, gCounter.nextAsString());

    if (Boolean(pTrans.note)){
        pTrans.noteName = `note_${pTrans.name}`;
    }

    return pTrans;
}

module.exports = (pAST, pOptions) => {
    pOptions = pOptions || {};
    gCounter = new counter.Counter();

    let lAST = _cloneDeep(pAST);
    const lStateMachineModel = new StateMachineModel(lAST);
    lAST.states = transformStates(lAST.states, pOptions.direction);
    lAST.transitions = transformTransitions(lStateMachineModel);
    lAST = splitStates(lAST);

    if (pOptions.direction === "left-right"){
        lAST.direction = "LR";
    }

    return Handlebars.templates['dot.template.hbs'](lAST);
};
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
