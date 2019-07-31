const fastxml = require('fast-xml-parser');
const he = require('he');
const _get = require('lodash.get');
const normalizeMachine = require('./normalizeMachine');
const arrayify = require('./utl').arrayify;

function extractActions(pState, pActionType) {
    return arrayify(pState[pActionType])
        .map(
            (pAction) => (
                {
                    type: pActionType === "onexit" ? "exit" : "entry",
                    body: he.decode(pAction).trim()
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
    return lRetval.trim();
}

function extractTransitionAttributesFromObject(pTransition) {
    const lRetval = {};

    if (pTransition.event) {
        // SCXML uses spaces to distinguish multiple events
        // the smcat ast uses linebreaks
        lRetval.event = pTransition.event.split(/\s+/).join("\n");
    }
    if (pTransition.cond) {
        lRetval.cond = pTransition.cond;
    }
    if (pTransition["#text"]) {
        lRetval.action = he.decode(pTransition["#text"]).trim();
    }

    return lRetval;
}

function extractTransitionAttributes(pTransition) {
    const lRetval = {};

    if (typeof pTransition === 'string') {
        lRetval.action = he.decode(pTransition).trim();
    } else {
        Object.assign(
            lRetval,
            extractTransitionAttributesFromObject(pTransition)
        );
    }

    const lLabel = formatLabel(lRetval.event, lRetval.cond, lRetval.action);
    if (lLabel) {
        lRetval.label = lLabel;
    }

    return lRetval;
}

function reduceTransition(pState) {
    return (pAllTransitions, pTransition) => {
        // in SCXML spaces denote references to multiple states
        // => split into multiple transitions
        const lTargets = (pTransition.target || pState.id).split(/\s+/);
        const lTransitionAttributes = extractTransitionAttributes(pTransition);

        return pAllTransitions.concat(
            lTargets.map(
                (pTarget) =>
                    Object.assign(
                        {
                            from: pState.id,
                            // a 'target-less transition' is typically
                            // a self-transition
                            to: pTarget
                        },
                        lTransitionAttributes
                    )
            )
        );
    };
}

function extractTransitions(pStates) {
    return pStates
        .filter((pState) => pState.hasOwnProperty("transition"))
        .reduce(
            (pAllTransitions, pThisState) =>
                pAllTransitions.concat(
                    arrayify(pThisState.transition).reduce(reduceTransition(pThisState), [])
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
    return lRetval;
}

module.exports = {
    parse: (pSCXMLString) => {
        const lSCXMLString = pSCXMLString.trim();

        if (fastxml.validate(lSCXMLString) === true) {
            const lXMLAsJSON = fastxml.parse(lSCXMLString, {
                attributeNamePrefix: "",
                ignoreAttributes: false,
                tagValueProcessor : (pTagValue) => he.decode(pTagValue),
                stopNodes: ["onentry", "onexit", "transition"]
            });
            // console.log(JSON.stringify(lXMLAsJSON, null, " "));

            return mapMachine(_get(lXMLAsJSON, "scxml", {}));
        }
        throw new Error("That doesn't look like valid xml ...\n");
    }
};
