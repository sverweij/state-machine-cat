const fastxml = require("fast-xml-parser");
const _get = require('lodash.get');

function arrayify(pThing) {
    return Array.isArray(pThing) ? pThing : [pThing];
}

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

function mapTransition(pState) {
    // TODO: transitions without a target
    return (pTransition) => {
        const lRetval = {
            from: pState.id,
            to: pTransition.target
        };
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
    };
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
    const lInitial = _get(pMachine, "initial");
    const lStates = arrayify(_get(pMachine, "state", []));
    let lInitialPseudoState = [];
    let lInitialTransition = [];
    const lRetval = {};

    if (lInitial) {
        lInitialPseudoState = [{
            name: "initial",
            type: "initial"
        }];
        if (typeof lInitial === "string"){
            lInitialTransition = [{
                from: "initial",
                to: lInitial
            }];
        } else if (_get(lInitial, "transition")) {
            lInitialTransition = [mapTransition(lInitial)(_get(lInitial, "transition", {}))];
        }
    }

    lRetval.states = lInitialPseudoState
        .concat(lStates.map(mapState("regular")))
        .concat(arrayify(_get(pMachine, "parallel", [])).map(mapState("parallel")))
        .concat(arrayify(_get(pMachine, "history", [])).map(mapState("history")))
        .concat(arrayify(_get(pMachine, "final", [])).map(mapState("final")));

    const lTransitions = lInitialTransition
        .concat(extractTransitions(lStates));

    if (lTransitions.length > 0) {
        lRetval.transitions = lTransitions;
    }
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
