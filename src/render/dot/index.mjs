import _cloneDeep from "lodash.clonedeep";
import options from "../../options.mjs";
import StateMachineModel from "../../state-machine-model.mjs";
import attributebuilder from "./attributebuilder.mjs";
import stateTransformers from "./state-transformers.mjs";
import transitionTransformers from "./transition-transformers.mjs";
import Counter from "./counter.mjs";
import renderDotFromAST from "./render-dot-from-ast.js";
import utl from "./utl.mjs";

let gCounter = {};

function addExternalSelfTransitions(pStateMachineModel) {
  return (pState) => {
    if (Object.prototype.hasOwnProperty.call(pState, "statemachine")) {
      pState.nestedExternalSelfTransitions = pStateMachineModel
        .findExternalSelfTransitions(pState.name)
        .map((pTransition) => pTransition.name);
    }
    return pState;
  };
}

function transformStates(
  pStates,
  pDirection,
  pNodeAttributes,
  pStateMachineModel
) {
  pStates
    .filter((pState) => pState.statemachine)
    .forEach((pState) => {
      pState.statemachine.states = transformStates(
        pState.statemachine.states,
        pDirection,
        pNodeAttributes,
        pStateMachineModel
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

function splitStates(pAST) {
  pAST.initialStates = pAST.states.filter(stateTransformers.isType("initial"));
  pAST.regularStates = pAST.states.filter(
    (pState) =>
      stateTransformers.isType("regular")(pState) && !pState.statemachine
  );
  pAST.historyStates = pAST.states.filter(stateTransformers.isType("history"));
  pAST.deepHistoryStates = pAST.states.filter(
    stateTransformers.isType("deephistory")
  );
  pAST.choiceStates = pAST.states.filter(stateTransformers.isType("choice"));
  pAST.forkjoinStates = pAST.states.filter(
    stateTransformers.isOneOfTypes(["fork", "join", "forkjoin"])
  );
  pAST.junctionStates = pAST.states.filter(
    stateTransformers.isType("junction")
  );
  pAST.terminateStates = pAST.states.filter(
    stateTransformers.isType("terminate")
  );
  pAST.finalStates = pAST.states.filter(stateTransformers.isType("final"));
  pAST.compositeStates = pAST.states.filter((pState) => pState.statemachine);

  return pAST;
}

function addEndTypes(pStateMachineModel) {
  return (pTransition) => {
    if (pStateMachineModel.findStateByName(pTransition.from).statemachine) {
      pTransition.fromComposite = true;
    }
    if (pStateMachineModel.findStateByName(pTransition.to).statemachine) {
      pTransition.toComposite = true;
    }

    return pTransition;
  };
}

function addCompositeSelfFlag(pStateMachineModel) {
  return (pTransition) => {
    let lAdditionalAttributes = {};

    if (utl.isCompositeSelf(pStateMachineModel, pTransition)) {
      if (pStateMachineModel.findStateByName(pTransition.from).hasParent) {
        lAdditionalAttributes = { hasParent: true, isCompositeSelf: true };
      } else {
        lAdditionalAttributes = { isCompositeSelf: true };
      }
    }
    return { ...pTransition, ...lAdditionalAttributes };
  };
}

function nameTransition(pTrans) {
  pTrans.name = `tr_${pTrans.from}_${pTrans.to}_${gCounter.nextAsString()}`;

  if (Boolean(pTrans.note)) {
    pTrans.noteName = `note_${pTrans.name}`;
  }

  return pTrans;
}

function transformTransitions(pStateMachineModel, pDirection) {
  return pStateMachineModel.flattenedTransitions
    .map(nameTransition)
    .map(transitionTransformers.escapeTransitionStrings)
    .map(transitionTransformers.classifyTransition)
    .map(stateTransformers.flattenNote)
    .map(addEndTypes(pStateMachineModel))
    .map(addCompositeSelfFlag(pStateMachineModel))
    .map(transitionTransformers.addPorts(pDirection));
}

export default (pAST, pOptions) => {
  pOptions = pOptions || {};
  gCounter = new Counter();

  let lAST = _cloneDeep(pAST);
  const lStateMachineModel = new StateMachineModel(lAST);

  lAST.transitions = transformTransitions(
    lStateMachineModel,
    pOptions.direction
  );

  lAST.states = transformStates(
    lAST.states,
    pOptions.direction,
    pOptions.dotNodeAttrs,
    lStateMachineModel
  );

  lAST = splitStates(lAST);

  lAST.graphAttributes = attributebuilder.buildGraphAttributes(
    options.getOptionValue(pOptions, "engine"),
    options.getOptionValue(pOptions, "direction"),
    pOptions.dotGraphAttrs
  );
  lAST.nodeAttributes = attributebuilder.buildNodeAttributes(
    pOptions.dotNodeAttrs
  );
  lAST.edgeAttributes = attributebuilder.buildEdgeAttributes(
    pOptions.dotEdgeAttrs
  );
  return renderDotFromAST(lAST);
};
