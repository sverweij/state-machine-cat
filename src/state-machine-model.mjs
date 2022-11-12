// @ts-check
/**
 * @param {import("../types/state-machine-cat").IState[]} pStates
 * @param {boolean} pHasParent
 * @returns {any} // IFlattenedState  - a state, but flattened (statemachine is a boolean, the new attr hasParent as well)
 */
function flattenStates(pStates, pHasParent = false) {
  let lReturnValue = [];

  pStates
    .filter((pState) => Boolean(pState.statemachine))
    .forEach((pState) => {
      if (Object.prototype.hasOwnProperty.call(pState.statemachine, "states")) {
        lReturnValue = lReturnValue.concat(
          // @ts-expect-error TS doesn't detect that after the call in the filter
          // the .statemachine is guaranteed to exist
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

/**
 * @param {import("../types/state-machine-cat").IStateMachine} pStateMachine
 * @returns {import("../types/state-machine-cat").ITransition[]}
 */
function flattenTransitions(pStateMachine) {
  /** @type {import("../types/state-machine-cat").ITransition[]} */
  let lTransitions = [];

  if (Object.prototype.hasOwnProperty.call(pStateMachine, "transitions")) {
    // @ts-expect-error TS doesn't detect that after the call in the if the
    // .transitions is guaranteed to exist
    lTransitions = pStateMachine.transitions;
  }
  if (Object.prototype.hasOwnProperty.call(pStateMachine, "states")) {
    pStateMachine.states
      .filter((pState) => Boolean(pState.statemachine))
      .forEach((pState) => {
        lTransitions = lTransitions.concat(
          // @ts-expect-error TS doesn't detect that after the call in the filter
          // the .statemachine is guaranteed to exist
          flattenTransitions(pState.statemachine)
        );
      });
  }
  return lTransitions;
}

export default class StateMachineModel {
  /**
   * @param {import("../types/state-machine-cat").IStateMachine} pStateMachine
   */
  constructor(pStateMachine) {
    this._flattenedStates = flattenStates(pStateMachine.states || []);
    this._flattenedTransitions = flattenTransitions(pStateMachine);
  }
  /**
   * @returns {import("../types/state-machine-cat").ITransition[]}
   */
  get flattenedTransitions() {
    return this._flattenedTransitions;
  }

  /**
   * @param {string} pName
   * @returns {any} // IFlattenedState
   */
  findStateByName(pName) {
    return this._flattenedStates.find((pState) => pState.name === pName);
  }

  /**
   * @param {import("../types/state-machine-cat").StateType[]} pTypes
   * @returns {any} // IFlattenedState
   */
  findStatesByTypes(pTypes) {
    return this._flattenedStates.filter((pState) =>
      pTypes.includes(pState.type)
    );
  }

  /**
   * @param {string} pStateName
   * @returns {import("../types/state-machine-cat").ITransition[]}
   */
  findExternalSelfTransitions(pStateName) {
    return this._flattenedTransitions.filter(
      (pTransition) =>
        pTransition.from === pStateName &&
        pTransition.to === pStateName &&
        pTransition.type !== "internal"
    );
  }

  /**
   * @param {string} pFromStateName
   * @returns {import("../types/state-machine-cat").ITransition[]}
   */
  findTransitionsByFrom(pFromStateName) {
    return this._flattenedTransitions.filter(
      (pTransition) => pTransition.from === pFromStateName
    );
  }

  /**
   * @param {string} pToStateName
   * @returns {import("../types/state-machine-cat").ITransition[]}
   */
  findTransitionsByTo(pToStateName) {
    return this._flattenedTransitions.filter(
      (pTransition) => pTransition.to === pToStateName
    );
  }
}
