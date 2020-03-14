/* eslint-disable security/detect-object-injection */
const fastxml = require("fast-xml-parser");
const he = require("he");
const _castArray = require("lodash.castarray");
const _get = require("lodash.get");
const formatLabel = require("../../transform/utl").formatLabel;
const parserHelpers = require("../parser-helpers");
const normalizeMachine = require("./normalize-machine");

function extractActions(pState, pActionType) {
  return _castArray(pState[pActionType]).map(pAction => ({
    type: pActionType === "onexit" ? "exit" : "entry",
    body: he.decode(pAction).trim()
  }));
}

function deriveActions(pState) {
  let lReturnValue = [];

  if (pState.onentry) {
    lReturnValue = lReturnValue.concat(extractActions(pState, "onentry"));
  }
  if (pState.onexit) {
    lReturnValue = lReturnValue.concat(extractActions(pState, "onexit"));
  }
  return lReturnValue;
}

function deriveStateType(pType, pState) {
  return pType === "history" && pState.type === "deep" ? "deephistory" : pType;
}

function mapState(pType) {
  return pState => {
    const lReturnValue = {
      name: pState.id,
      type: deriveStateType(pType, pState)
    };

    if (parserHelpers.getStateType(pState.id) !== lReturnValue.type) {
      lReturnValue.typeExplicitlySet = true;
    }
    if (pState.onentry || pState.onexit) {
      lReturnValue.actions = deriveActions(pState);
    }
    if (
      Object.keys(pState).some(pKey =>
        ["initial", "state", "history", "parallel", "final"].includes(pKey)
      )
    ) {
      // recursion, so ...
      // eslint-disable-next-line no-use-before-define
      lReturnValue.statemachine = mapMachine(pState);
    }
    return lReturnValue;
  };
}

function extractTransitionAttributesFromObject(pTransition) {
  const lReturnValue = {};

  if (pTransition.event) {
    // SCXML uses spaces to distinguish multiple events
    // the smcat ast uses linebreaks
    lReturnValue.event = pTransition.event.split(/\s+/).join("\n");
  }
  if (pTransition.cond) {
    lReturnValue.cond = pTransition.cond;
  }
  if (pTransition["#text"]) {
    lReturnValue.action = he.decode(pTransition["#text"]).trim();
  }

  if (pTransition.type) {
    lReturnValue.type = pTransition.type;
  }

  return lReturnValue;
}

function extractTransitionAttributes(pTransition) {
  const lReturnValue = {};

  if (typeof pTransition === "string") {
    lReturnValue.action = he.decode(pTransition).trim();
  } else {
    Object.assign(
      lReturnValue,
      extractTransitionAttributesFromObject(pTransition)
    );
  }

  const lLabel = formatLabel(
    lReturnValue.event,
    lReturnValue.cond,
    lReturnValue.action
  );

  if (lLabel) {
    lReturnValue.label = lLabel;
  }

  return lReturnValue;
}

function reduceTransition(pState) {
  return (pAllTransitions, pTransition) => {
    // in SCXML spaces denote references to multiple states
    // => split into multiple transitions
    const lTargets = (pTransition.target || pState.id).split(/\s+/);
    const lTransitionAttributes = extractTransitionAttributes(pTransition);

    return pAllTransitions.concat(
      lTargets.map(pTarget =>
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
    .filter(pState => pState.hasOwnProperty("transition"))
    .reduce(
      (pAllTransitions, pThisState) =>
        pAllTransitions.concat(
          _castArray(pThisState.transition).reduce(
            reduceTransition(pThisState),
            []
          )
        ),
      []
    );
}

function mapMachine(pMachine) {
  const lMachine = normalizeMachine(pMachine);
  const lReturnValue = {};

  lReturnValue.states = lMachine.initial
    .map(mapState("initial"))
    .concat(lMachine.state.map(mapState("regular")))
    .concat(lMachine.parallel.map(mapState("parallel")))
    .concat(lMachine.history.map(mapState("history")))
    .concat(lMachine.final.map(mapState("final")));

  const lTransitions = extractTransitions(lMachine.initial)
    .concat(extractTransitions(lMachine.state))
    .concat(extractTransitions(lMachine.parallel));

  if (lTransitions.length > 0) {
    lReturnValue.transitions = lTransitions;
  }
  return lReturnValue;
}

/**
 * Parses SCXML into a state machine AST.
 *
 * @param {string} pSCXMLString The SCXML to parse
 * @returns {IStateMachine} state machine AST
 */
function parse(pSCXMLString) {
  const lSCXMLString = pSCXMLString.trim();

  if (fastxml.validate(lSCXMLString) === true) {
    const lXMLAsJSON = fastxml.parse(lSCXMLString, {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      tagValueProcessor: pTagValue => he.decode(pTagValue),
      stopNodes: ["onentry", "onexit", "transition"]
    });

    return mapMachine(_get(lXMLAsJSON, "scxml", {}));
  }
  throw new Error("That doesn't look like valid xml ...\n");
}

module.exports = {
  parse
};
