const fastxml = require("fast-xml-parser");
const _get = require('lodash.get');
const parserHelpers = require('../parserHelpers');
const normalizeMachine = require('./normalizeMachine');
const arrayify = require('./utl').arrayify;

function extractActions(pState, pActionType) {
    return arrayify(pState[pActionType])
        .map(
            (pAction) => (
                {
                    type: pActionType === "onexit" ? "exit" : "entry",
                    body: pAction
                }
            )
        );
}

function deriveActions(pState) {
    let lRetval = [];
    if (pState.onentry) {
        lRetval = lRetval.concat(extractActions(pState, "onentry"));
    }
    if (pState.onexit) {
        lRetval = lRetval.concat(extractActions(pState, "onexit"));
    }
    return lRetval;
}

function deriveStateType(pType, pState) {
    return pType === "history" && pState.type === "deep"
        ? "deephistory"
        : pType;
}

function mapState(pType) {
    return (pState) => {
        const lRetval = {
            name: pState.id,
            type: deriveStateType(pType, pState)
        };
        if (pState.onentry || pState.onexit) {
            lRetval.actions = deriveActions(pState);
        }
        if (Object.keys(pState).some((pKey) => ["initial", "state", "history", "parallel", "final"].includes(pKey))) {
            lRetval.isComposite = true;
            lRetval.statemachine = mapMachine(pState);
        }
        return lRetval;
    };
}

function formatLabel(pEvent, pCond, pActions) {
    let lRetval = "";
    if (pEvent) {
        lRetval += pEvent;
    }
    if (pCond) {
        lRetval += ` [${pCond}]`;
    }
    if (pActions) {
        lRetval += `/ ${pActions}`;
    }
    return lRetval;
}

function extractTransitionAttributes(pTransition) {
    const lRetval = {};

    if (pTransition.event) {
        // SCXML uses spaces to distinguish multiple events
        // the smcat ast uses linebreaks
        lRetval.event = pTransition.event.split(" ").join("\n");
    }
    if (pTransition.cond) {
        lRetval.cond = pTransition.cond;
    }
    if (pTransition["#text"]) {
        lRetval.action = pTransition["#text"];
    }
    const lLabel = formatLabel(lRetval.event, lRetval.cond, lRetval.action);
    if (lLabel) {
        lRetval.label = lLabel;
    }

    return lRetval;
}

function mapTransition(pState) {
    return (pTransition) =>
        Object.assign(
            {
                from: pState.id,
                to: pTransition.target || "__no_target__"
            },
            extractTransitionAttributes(pTransition)
        );
}

function extractTransitions(pStates) {
    return pStates
        .filter((pState) => pState.hasOwnProperty("transition"))
        .reduce(
            (pAllTransitions, pThisState) =>
                pAllTransitions.concat(
                    arrayify(pThisState.transition).map(mapTransition(pThisState))
                ),
            []
        );
}


function mapMachine(pMachine) {
    const lMachine = normalizeMachine(pMachine);
    const lRetval = {};

    lRetval.states = lMachine.initial.map(mapState("initial"))
        .concat(lMachine.state.map(mapState("regular")))
        .concat(lMachine.parallel.map(mapState("parallel")))
        .concat(lMachine.history.map(mapState("history")))
        .concat(lMachine.final.map(mapState("final")));

    const lTransitions = extractTransitions(lMachine.initial)
        .concat(extractTransitions(lMachine.state));

    if (lTransitions.length > 0) {
        lRetval.transitions = lTransitions;
    }
    parserHelpers.extractUndeclaredStates(lRetval);
    return lRetval;
}

module.exports = {
    parse: (pSCXMLString) => {
        const lSCXMLString = pSCXMLString.trim();

        if (fastxml.validate(lSCXMLString) === true) {
            const lXMLAsJSON = fastxml.parse(lSCXMLString, {
                attributeNamePrefix: "",
                ignoreAttributes: false
            });
            return mapMachine(_get(lXMLAsJSON, "scxml", {}));
        }
        throw new Error("That doesn't look like valid xml ...\n");
    }
};
