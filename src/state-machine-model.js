function flattenStates(pStates, pHasParent = false) {
  let lReturnValue = [];

  pStates
    .filter((pState) => Boolean(pState.statemachine))
    .forEach((pState) => {
      if (Object.prototype.hasOwnProperty.call(pState.statemachine, "states")) {
        lReturnValue = lReturnValue.concat(
          flattenStates(pState.statemachine.states, true)
        );
      }
    });

  return lReturnValue.concat(
    pStates.map((pState) => ({
      name: pState.name,
      type: pState.type,
      statemachine: Boolean(pState.statemachine),
      hasParent: pHasParent,
    }))
  );
}

function flattenTransitions(pStateMachine) {
  let lTransitions = [];

  if (Object.prototype.hasOwnProperty.call(pStateMachine, "transitions")) {
    lTransitions = pStateMachine.transitions;
  }
  if (Object.prototype.hasOwnProperty.call(pStateMachine, "states")) {
    pStateMachine.states
      .filter((pState) => Boolean(pState.statemachine))
      .forEach((pState) => {
        lTransitions = lTransitions.concat(
          flattenTransitions(pState.statemachine)
        );
      });
  }
  return lTransitions;
}

class StateMachineModel {
  constructor(pAST) {
    this._flattenedStates = flattenStates(pAST.states || []);
    this._flattenedTransitions = flattenTransitions(pAST);
  }

  get flattenedTransitions() {
    return this._flattenedTransitions;
  }

  findStateByName(pName) {
    return this._flattenedStates.find((pState) => pState.name === pName);
  }

  findStatesByTypes(pTypes) {
    return this._flattenedStates.filter((pState) =>
      pTypes.includes(pState.type)
    );
  }

  findExternalSelfTransitions(pStateName) {
    return this._flattenedTransitions.filter(
      (pTransition) =>
        pTransition.from === pStateName &&
        pTransition.to === pStateName &&
        pTransition.type !== "internal"
    );
  }

  findTransitionsByFrom(pFromStateName) {
    return this._flattenedTransitions.filter(
      (pTransition) => pTransition.from === pFromStateName
    );
  }

  findTransitionsByTo(pToStateName) {
    return this._flattenedTransitions.filter(
      (pTransition) => pTransition.to === pToStateName
    );
  }
}

module.exports = StateMachineModel;
