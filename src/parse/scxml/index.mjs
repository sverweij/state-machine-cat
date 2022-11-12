/* eslint-disable security/detect-object-injection */
import fastxml from "fast-xml-parser";
import he from "he";
import castArray from "lodash/castArray.js";
import utl from "../../transform/utl.mjs";
import parserHelpers from "../parser-helpers.mjs";
import normalizeMachine from "./normalize-machine.mjs";

const formatLabel = utl.formatLabel;

function extractActions(pState, pActionType) {
  return castArray(pState[pActionType]).map((pAction) => ({
    type: pActionType === "onexit" ? "exit" : "entry",
    body: he.decode(pAction).trim(),
  }));
}

function extractActionsFromInvokes(pInvokeTriggers) {
  return castArray(pInvokeTriggers).map((pInvokeTrigger) => {
    const lId = he.decode(pInvokeTrigger.id || "").trim();

    return {
      type: "activity",
      body: lId || he.decode(pInvokeTrigger || "").trim(),
    };
  });
}

/**
 * @param {import("./scxml").ISXCMLState} pState
 * @returns {{type: string; body: string;}[]}
 */

function deriveActions(pState) {
  let lReturnValue = [];

  if (pState.onentry) {
    lReturnValue = lReturnValue.concat(extractActions(pState, "onentry"));
  }
  if (pState.invoke) {
    lReturnValue = lReturnValue.concat(
      extractActionsFromInvokes(pState.invoke)
    );
  }
  if (pState.onexit) {
    lReturnValue = lReturnValue.concat(extractActions(pState, "onexit"));
  }
  return lReturnValue;
}

/**
 * @param {string} pType
 * @param {import("./scxml").ISXCMLState} pState
 * @returns {import("../../../types/state-machine-cat").StateType}
 */
function deriveStateType(pType, pState) {
  return pType === "history" && pState.type === "deep" ? "deephistory" : pType;
}

function mapState(pType) {
  /**
   * @param {import("./scxml").ISXCMLState} pState
   * @return {import("../../../types/state-machine-cat").IState}
   */
  return (pState) => {
    const lReturnValue = {
      name: pState.id,
      type: deriveStateType(pType, pState),
    };

    if (parserHelpers.getStateType(pState.id) !== lReturnValue.type) {
      lReturnValue.typeExplicitlySet = true;
    }
    if (pState.onentry || pState.onexit || pState.invoke) {
      lReturnValue.actions = deriveActions(pState);
    }
    if (
      Object.keys(pState).some((pKey) =>
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

/**
 * @param {import("./scxml").ISCXMLTransition} pTransition
 * @returns {{event?: string; cond?: string; action?: string; type?: string;}}
 */
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

/**
 *
 * @param {import("./scxml").ISCXMLTransition} pTransition
 * @returns {{action?: string; label?: string;event?: string; cond?: string; type?: string}}
 */
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

/**
 * @param {import("./scxml").ISXCMLState} pState
 */
function reduceTransition(pState) {
  /**
   * @param {import("../../../types/state-machine-cat").ITransition[]} pAllTransitions
   * @param {import("../../../types/state-machine-cat").ITransition} pTransition
   * @returns {import("../../../types/state-machine-cat").ITransition}
   */
  return (pAllTransitions, pTransition) => {
    // in SCXML spaces denote references to multiple states
    // => split into multiple transitions
    const lTargets = (pTransition.target || pState.id).split(/\s+/);
    const lTransitionAttributes = extractTransitionAttributes(pTransition);

    return pAllTransitions.concat(
      lTargets.map((pTarget) => ({
        from: pState.id,
        // a 'target-less transition' is typically
        // a self-transition
        to: pTarget,
        ...lTransitionAttributes,
      }))
    );
  };
}

/**
 * @param {import("./scxml").ISXCMLState[]} pStates
 * @returns {import("../../../types/state-machine-cat").ITransition[]}
 */
function extractTransitions(pStates) {
  return pStates
    .filter((pState) =>
      Object.prototype.hasOwnProperty.call(pState, "transition")
    )
    .reduce(
      (pAllTransitions, pThisState) =>
        pAllTransitions.concat(
          castArray(pThisState.transition).reduce(
            reduceTransition(pThisState),
            []
          )
        ),
      []
    );
}

/**
 * @param {import("./scxml").ISCXMLMachine} pMachine
 * @returns {import("../../../types/state-machine-cat").IStateMachine}
 */
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
 * @returns {import("../../../types/state-machine-cat").IStateMachine} state machine AST
 */
export function parse(pSCXMLString) {
  const lSCXMLString = pSCXMLString.trim();

  if (fastxml.validate(lSCXMLString) === true) {
    const lXMLAsJSON = fastxml.parse(lSCXMLString, {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      tagValueProcessor: (pTagValue) => he.decode(pTagValue),
      stopNodes: ["onentry", "onexit", "transition"],
    });

    return mapMachine(lXMLAsJSON?.scxml ?? {});
  }
  throw new Error("That doesn't look like valid xml ...\n");
}
