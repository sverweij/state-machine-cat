/* eslint-disable security/detect-object-injection */
import fastxml from "fast-xml-parser";
import he from "he";
import traverse from "traverse";
import utl from "../../transform/utl.mjs";
import parserHelpers from "../parser-helpers.mjs";
import { castArray } from "./utl.mjs";
import { normalizeMachine } from "./normalize-machine.mjs";

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
 * @param {import("./scxml").INormalizedSCXMLState} pState
 * @returns {any[]}
 */
function deriveActions(pState) {
  let lReturnValue = [];

  if (pState.onentry) {
    lReturnValue = lReturnValue.concat(extractActions(pState, "onentry"));
  }
  if (pState.invoke) {
    lReturnValue = lReturnValue.concat(
      extractActionsFromInvokes(pState.invoke),
    );
  }
  if (pState.onexit) {
    lReturnValue = lReturnValue.concat(extractActions(pState, "onexit"));
  }
  return lReturnValue;
}

/**
 * @param {import("../../..").StateType} pType
 * @param {import("./scxml").ISCXMLHistoryState} pState
 * @param {any} pState
 * @returns {import("../../..").StateType}
 */
function deriveStateType(pType, pState) {
  return pType === "history" && pState.type === "deep" ? "deephistory" : pType;
}

/**
 * @param {import("../../../types/state-machine-cat").StateType} pType
 * @returns {(any) => import("../../..").IState}
 */
function mapState(pType) {
  return (pState) => {
    /** @type {import("../../../types/state-machine-cat").IState} */
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
        ["initial", "state", "history", "parallel", "final"].includes(pKey),
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
      extractTransitionAttributesFromObject(pTransition),
    );
  }

  const lLabel = formatLabel(
    lReturnValue.event,
    lReturnValue.cond,
    lReturnValue.action,
  );

  if (lLabel) {
    lReturnValue.label = lLabel;
  }

  return lReturnValue;
}

/**
 * @param {import("./scxml").INormalizedSCXMLState} pState
 */
function reduceTransition(pState) {
  /**
   * @param {import("./scxml").ISCXMLTransition[]} pAllTransitions
   * @param {import("./scxml").ISCXMLTransition} pTransition
   * @returns {import("../../..").ITransition}
   */
  return (pAllTransitions, pTransition) => {
    // in SCXML spaces denote references to multiple states
    // => split into multiple transitions
    const lTargets = (pTransition?.target ?? pState.id).split(/\s+/);
    const lTransitionAttributes = extractTransitionAttributes(pTransition);

    return pAllTransitions.concat(
      lTargets.map((pTarget) => ({
        from: pState.id,
        // a 'target-less transition' is typically
        // a self-transition
        to: pTarget,
        ...lTransitionAttributes,
      })),
    );
  };
}

/**
 * @param {import("./scxml").INormalizedSCXMLState[]} pStates
 * @returns {import("../../../types/state-machine-cat").ITransition[]}
 */
function extractTransitions(pStates) {
  return pStates
    .filter((pState) => Object.hasOwn(pState, "transition"))
    .reduce((pAllTransitions, pThisState) => {
      const lTransitionAsArray = castArray(pThisState.transition);
      return pAllTransitions.concat(
        lTransitionAsArray.reduce(reduceTransition(pThisState), []),
      );
    }, []);
}

/**
 * @param {any} pSCXMLStateMachine
 * @returns {import("../../..").IStateMachine}
 */
function mapMachine(pSCXMLStateMachine) {
  const lNormalizedMachine = normalizeMachine(pSCXMLStateMachine);
  const lReturnValue = {
    states: lNormalizedMachine.initial
      .map(mapState("initial"))
      .concat(lNormalizedMachine.state.map(mapState("regular")))
      .concat(lNormalizedMachine.parallel.map(mapState("parallel")))
      .concat(lNormalizedMachine.history.map(mapState("history")))
      .concat(lNormalizedMachine.final.map(mapState("final"))),
  };

  const lTransitions = extractTransitions(lNormalizedMachine.initial)
    .concat(extractTransitions(lNormalizedMachine.state))
    .concat(extractTransitions(lNormalizedMachine.parallel));

  if (lTransitions.length > 0) {
    lReturnValue.transitions = lTransitions;
  }
  return lReturnValue;
}

/**
 * This funky looking replace  exists to make the output of the fast-xml-parser
 * backwards compatible with its version 3 that in case of conflicts between
 * attribute names and tag names gave preference to the attribute name (version 4
 * does the opposite). The previous behaviour was undocumented and for fast-xml-parser
 * likely a kind of edge case (normal people probably don't pass an empty attributeNamePrefix).
 *
 * @param {any} pObject
 * @param {string} pAttributeNamePrefix
 * @returns {any} the object, but
 * - with attributes that have the same name as tags in the same parent removed,
 * - attributes that don't have an equally named tag get their key renamed back
 *   to the one without the pAttributeNamePrefix
 */
function deDuplicateAttributesAndTags(pObject, pAttributeNamePrefix) {
  // - 'traverse' relies on the 'this' property a 'normal' function provides,
  //   so this is not an arrow function.
  // - while it looks iffy to have a map function without a return statement
  //   it's canonical traverse use (as per https://github.com/ljharb/js-traverse/blob/v0.6.7/README.md)
  // eslint-disable-next-line array-callback-return
  return traverse(pObject).map(function deDuplicate() {
    if (this.key?.startsWith(pAttributeNamePrefix)) {
      const pUnPrefixedAttributeName = this.key.slice(
        pAttributeNamePrefix.length,
      );
      if (this.parent.keys.includes(pUnPrefixedAttributeName)) {
        this.remove();
      } else {
        this.parent.node[pUnPrefixedAttributeName] = this.node;
        this.remove();
      }
    }
  });
}

/**
 * Parses SCXML into a state machine AST.
 *
 * @param {string} pSCXMLString The SCXML to parse
 * @returns {import("../../../types/state-machine-cat").IStateMachine} state machine AST
 */
export function parse(pSCXMLString) {
  const lTrimmedSCXMLString = pSCXMLString.trim();
  const lAttributeNamePrefix = "@_";
  /** @type {import("./scxml").ISCXMLAsJSON} */
  let lXMLAsJSON = {};

  const lXMLParser = new fastxml.XMLParser({
    attributeNamePrefix: lAttributeNamePrefix,
    ignoreAttributes: false,
    parseTagValue: true,
    processEntities: false,
    tagValueProcessor: (_pTagName, pTagValue) => he.decode(pTagValue),
    stopNodes: ["*.onentry", "*.onexit", "*.transition"],
  });

  try {
    lXMLAsJSON = deDuplicateAttributesAndTags(
      lXMLParser.parse(lTrimmedSCXMLString, true),
      lAttributeNamePrefix,
    );
  } catch (pError) {
    throw new Error("That doesn't look like valid xml ...\n");
  }
  return mapMachine(
    lXMLAsJSON?.scxml ?? {
      xmlns: "http://www.w3.org/2005/07/scxml",
      version: "1.0",
    },
  );
}
