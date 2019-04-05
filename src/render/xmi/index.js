const Handlebars = require("handlebars/dist/handlebars.runtime");
const makeValidXMLName = require("../scjson/makeValidXMLName");

function stateType2UML(pType) {
    const UMLStateTypes = {
        initial: {type: "uml:Pseudostate", kind: "initial"},
        terminate: {type: "uml:Pseudostate", kind: "terminate"},
        regular: {type: "uml:State"},
        choice: {type: "uml:Pseudostate", kind: "choice"},
        forkjoin: {type: "uml:Pseudostate", kind: "fork"},
        fork: {type: "uml:Pseudostate", kind: "fork"},
        join: {type: "uml:Pseudostate", kind: "join"},
        junction: {type: "uml:Pseudostate", kind: "junction"},
        history: {type: "uml:Pseudostate", kind: "shallowHistory"},
        deephistory: {type: "uml:Pseudostate", kind: "deepHistory"},
        final: {type: "uml:FinalState"}
    };
    return UMLStateTypes[pType] || UMLStateTypes.regular;
}

function generateIdForName(pEvent, pName) {
    const lRetval = {};

    if (pEvent) {
        lRetval[`${pName}Id`] = makeValidXMLName(pEvent);
    }

    return lRetval;
}

function xlateTransitions(pTransitions) {
    return pTransitions
        ? {
            transitions: pTransitions.map(
                (pTransition) => Object.assign(
                    {},
                    pTransition,
                    generateIdForName(pTransition.cond, "cond"),
                    generateIdForName(pTransition.event, "event"),
                    generateIdForName(pTransition.action, "action"),
                    {
                        id: `${makeValidXMLName(pTransition.from)}_to_${makeValidXMLName(pTransition.to)}`,
                        from: makeValidXMLName(pTransition.from),
                        to: makeValidXMLName(pTransition.to)
                    }
                )
            )
        }
        : {};
}


function actionType2UML(pType) {
    const UMLActionTypes = {
        activity: "doActivity"
    };

    return UMLActionTypes[pType] || pType;
}

function xlateActions(pActions) {
    return pActions
        ? {
            actions: pActions.map(
                (pAction) => Object.assign(
                    {},
                    pAction,
                    {
                        type: actionType2UML(pAction.type)
                    }
                )
            )
        }
        : {};
}

function xlateStates(pStates, pRegionCounter) {
    return {
        regionCount: pRegionCounter.toString(10),
        states: pStates.map(
            (pState) => Object.assign(
                {},
                pState,
                {
                    name: pState.label || pState.name,
                    id: makeValidXMLName(pState.name)
                },
                stateType2UML(pState.type),
                xlateActions(pState.actions),
                pState.statemachine ? xlate(pState.statemachine, pRegionCounter + 1) : {}
            )
        )
    };
}

function xlate(pStateMachine, pRegionCounter = 0) {
    return Object.assign(
        {},
        xlateStates(pStateMachine.states, pRegionCounter),
        xlateTransitions(pStateMachine.transitions)
    );
}

/* eslint import/no-unassigned-import: 0 */
require("./xmi.template");
require("./xmi.states.template");

Handlebars.registerPartial(
    'xmi.states.template.hbs',
    Handlebars.templates['xmi.states.template.hbs']
);

module.exports = (pStateMachine) => Handlebars.templates['xmi.template.hbs'](xlate(pStateMachine));
