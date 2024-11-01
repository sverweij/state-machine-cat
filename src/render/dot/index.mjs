import { getOptionValue } from "../../options.mjs";
import StateMachineModel from "../../state-machine-model.mjs";
import attributebuilder from "./attributebuilder.mjs";
import stateTransformers from "./state-transformers.mjs";
import { transformTransitions } from "./transition-transformers.mjs";
import Counter from "./counter.mjs";
import renderDotFromAST from "./render-dot-from-ast.mjs";
import utl from "./utl.mjs";

/**
 * @param {StateMachineModel} pStateMachineModel
 * @returns {(pState: import("../../../types/state-machine-cat.js").IState) => import("../../../types/state-machine-cat.js").IState}
 */
function addExternalSelfTransitions(pStateMachineModel) {
  return (pState) => {
    if (Object.hasOwn(pState, "statemachine")) {
      pState.nestedExternalSelfTransitions = pStateMachineModel
        .findExternalSelfTransitions(pState.name)
        .map((pTransition) => pTransition.name);
    }
    return pState;
  };
}

/**
 * @param {import("../../../types/state-machine-cat.js").IState[]} pStates
 * @param {string} pDirection
 * @param {import("../../../types/state-machine-cat.js").dotAttributesType} pNodeAttributes
 * @param {StateMachineModel} pStateMachineModel
 * @returns {import("../../../types/state-machine-cat.js").IState[]}
 */
function transformStates(
  pStates,
  pDirection,
  pNodeAttributes,
  pStateMachineModel,
) {
  pStates
    .filter((pState) => pState.statemachine)
    .forEach((pState) => {
      // @ts-expect-error - statemachine is _not_ potentially undefined, because of
      // the filter
      pState.statemachine.states = transformStates(
        // @ts-expect-error - statemachine is _not_ potentially undefined, because of
        // the filter
        pState.statemachine.states,
        pDirection,
        pNodeAttributes,
        pStateMachineModel,
      );
    });

  return pStates
    .map(stateTransformers.setLabel)
    .map(stateTransformers.nameNote)
    .map(stateTransformers.classifyState)
    .map(stateTransformers.escapeStateStrings)
    .map(stateTransformers.flattenNote)
    .map(stateTransformers.flattenActions)
    .map(stateTransformers.flagParallelChildren)
    .map(stateTransformers.tipForkJoinStates(pDirection))
    .map(stateTransformers.recolor(pNodeAttributes))
    .map(addExternalSelfTransitions(pStateMachineModel));
}

/**
 *
 * @param {import("../../../types/state-machine-cat.js").IStateMachine} pStateMachine
 * @returns {import("../../../types/state-machine-cat.js").IStateMachine}
 */
function splitStates(pStateMachine) {
  pStateMachine.initialStates = pStateMachine.states.filter(
    stateTransformers.isType("initial"),
  );
  pStateMachine.regularStates = pStateMachine.states.filter(
    (pState) =>
      stateTransformers.isType("regular")(pState) && !pState.statemachine,
  );
  pStateMachine.historyStates = pStateMachine.states.filter(
    stateTransformers.isType("history"),
  );
  pStateMachine.deepHistoryStates = pStateMachine.states.filter(
    stateTransformers.isType("deephistory"),
  );
  pStateMachine.choiceStates = pStateMachine.states.filter(
    stateTransformers.isType("choice"),
  );
  pStateMachine.forkjoinStates = pStateMachine.states.filter(
    stateTransformers.isOneOfTypes(["fork", "join", "forkjoin"]),
  );
  pStateMachine.junctionStates = pStateMachine.states.filter(
    stateTransformers.isType("junction"),
  );
  pStateMachine.terminateStates = pStateMachine.states.filter(
    stateTransformers.isType("terminate"),
  );
  pStateMachine.finalStates = pStateMachine.states.filter(
    stateTransformers.isType("final"),
  );
  pStateMachine.compositeStates = pStateMachine.states.filter(
    (pState) => pState.statemachine,
  );

  return pStateMachine;
}

/** @type {import("../../../types/state-machine-cat.js").StringRenderFunctionType} */
export default (pStateMachine, pOptions) => {
  pOptions = pOptions || {};

  let lStateMachine = structuredClone(pStateMachine);
  const lStateMachineModel = new StateMachineModel(lStateMachine);

  lStateMachine.transitions = transformTransitions(
    lStateMachineModel,
    pOptions.direction,
    new Counter(),
  );

  lStateMachine.states = transformStates(
    lStateMachine.states,
    pOptions.direction,
    pOptions.dotNodeAttrs,
    lStateMachineModel,
  );

  lStateMachine = splitStates(lStateMachine);

  lStateMachine.graphAttributes = attributebuilder.buildGraphAttributes(
    getOptionValue(pOptions, "engine"),
    getOptionValue(pOptions, "direction"),
    pOptions.dotGraphAttrs,
  );
  lStateMachine.nodeAttributes = attributebuilder.buildNodeAttributes(
    pOptions.dotNodeAttrs,
  );
  lStateMachine.edgeAttributes = attributebuilder.buildEdgeAttributes(
    pOptions.dotEdgeAttrs,
  );
  return renderDotFromAST(lStateMachine);
};
