const Handlebars        = require('handlebars/dist/handlebars.runtime');
const _cloneDeep        = require('lodash.clonedeep');
const options           = require('../../options');
const StateMachineModel = require('../../stateMachineModel');
const Counter           = require('./counter');
const attributebuilder = require('./attributebuilder');

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
function isOneOfTypes(pStringArray){
    return function (pState){
        return pStringArray.indexOf(pState.type) >= 0;
    };
}

function setLabel(pState) {
    pState.label = pState.label || pState.name;
    return pState;
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

function escapeStateStrings(pState) {
    if (pState.note) {
        pState.note = pState.note.map(escapeString);
    }
    return pState;
}

function escapeTransitionStrings(pTransition) {
    if (pTransition.note) {
        pTransition.note = pTransition.note.map(escapeString);
    }
    if (pTransition.label) {
        pTransition.label = escapeLabelString(pTransition.label);
    }
    return pTransition;
}

function formatActionType(pString) {
    return pString === "activity" ? "" : `${pString}/ `;
}

function flattenActions(pState) {
    const lRetval = Object.assign({}, pState);

    if (pState.actions) {
        lRetval.actions = pState.actions
            .map((pAction) => `${formatActionType(pAction.type)}${pAction.body}`);
    }

    return lRetval;
}

function isVertical(pDirection){
    const lDirection = pDirection || "top-down";
    return lDirection === "top-down" || lDirection === "bottom-top";
}

function tipForkJoinStates(pDirection) {
    return function (pState) {
        if (isOneOfTypes(["fork", "join", "forkjoin"])(pState)){

            return Object.assign(
                {
                    sizingExtras: isVertical(pDirection) ? "height=0.1" : "width=0.1"
                },
                pState
            );
        }
        return pState;

    };
}

function flagParallelChildren(pState) {
    if (pState.type === "parallel") {
        if (pState.statemachine && pState.statemachine.states) {
            pState.statemachine.states = pState.statemachine.states
                .filter(isType("regular"))
                .map((pChildState) => Object.assign({}, pChildState, {parentIsParallel: true}));
        }
    }

    return pState;
}

function addSelfTransitionsFlag(pStateMachineModel) {
    return (pState) => {
        if (pState.hasOwnProperty("statemachine") && pStateMachineModel.stateHasSelfTransitions(pState.name)){
            pState.hasSelfTransitions = true;
        }
        return pState;
    };
}

function transformStates(pStates, pDirection, pStateMachineModel) {
    pStates
        .filter((pState) => pState.statemachine)
        .forEach((pState) => {
            pState.statemachine.states = transformStates(pState.statemachine.states, pDirection, pStateMachineModel);
        });

    return pStates
        .map(setLabel)
        .map(nameNote)
        .map(escapeStateStrings)
        .map(flattenNote)
        .map(flattenActions)
        .map(flagParallelChildren)
        .map(tipForkJoinStates(pDirection))
        .map(addSelfTransitionsFlag(pStateMachineModel));
}

function splitStates(pAST) {
    pAST.initialStates     = pAST.states.filter(isType("initial"));
    pAST.regularStates     = pAST.states.filter(
        (pState) => isType("regular")(pState) && !pState.statemachine
    );
    pAST.historyStates     = pAST.states.filter(isType("history"));
    pAST.deepHistoryStates = pAST.states.filter(isType("deephistory"));
    pAST.choiceStates      = pAST.states.filter(isType("choice"));
    pAST.forkjoinStates    = pAST.states.filter(isOneOfTypes(["fork", "join", "forkjoin"]));
    pAST.junctionStates    = pAST.states.filter(isType("junction"));
    pAST.terminateStates   = pAST.states.filter(isType("terminate"));
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

function addCompositeSelfFlag(pStateMachineModel){
    return (pTransition) => {
        let lAdditionalAttributes = {};
        if (
            pTransition.from === pTransition.to &&
            pStateMachineModel.findStateByName(pTransition.from).statemachine
        ) {
            lAdditionalAttributes = {isCompositeSelf: true};
        }
        return Object.assign({}, pTransition, lAdditionalAttributes);
    };
}

function addPorts(pDirection) {
    return (pTransition) => {
        let lAdditionalAttributes = {};
        if (pTransition.isCompositeSelf) {
            if (isVertical(pDirection)) {
                lAdditionalAttributes = {
                    tailportflags: `tailport="e" headport="e"`,
                    headportflags: `tailport="w"`
                };
            } else {
                lAdditionalAttributes = {
                    tailportflags: `tailport="s" headport="s"`,
                    headportflags: `tailport="n"`
                };
            }
        }
        return Object.assign({}, pTransition, lAdditionalAttributes);
    };
}

function transformTransitions(pStateMachineModel, pDirection) {
    return pStateMachineModel
        .flattenedTransitions
        .map(nameTransition)
        .map(escapeTransitionStrings)
        .map(flattenNote)
        .map(addEndTypes(pStateMachineModel))
        .map(addCompositeSelfFlag(pStateMachineModel))
        .map(addPorts(pDirection));

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
    gCounter = new Counter();

    let lAST = _cloneDeep(pAST);
    const lStateMachineModel = new StateMachineModel(lAST);
    lAST.states = transformStates(lAST.states, pOptions.direction, lStateMachineModel);

    lAST.transitions = transformTransitions(lStateMachineModel, pOptions.direction);
    lAST = splitStates(lAST);

    lAST.graphAttributes = attributebuilder.buildGraphAttributes(
        options.getOptionValue(pOptions, "engine"),
        options.getOptionValue(pOptions, "direction"),
        pOptions.dotGraphAttrs
    );
    lAST.nodeAttributes = attributebuilder.buildNodeAttributes(pOptions.dotNodeAttrs);
    lAST.edgeAttributes = attributebuilder.buildEdgeAttributes(pOptions.dotEdgeAttrs);

    return Handlebars.templates['dot.template.hbs'](lAST);
};
