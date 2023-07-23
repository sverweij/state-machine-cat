/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IState,
  IStateMachine,
  ITransition,
  StateType,
} from "types/state-machine-cat.js";

function flattenStates(pStates: IState[], pHasParent = false): any[] {
  let lReturnValue: any[] = [];

  pStates
    .filter((pState) => Boolean(pState.statemachine))
    .forEach((pState) => {
      if (Object.prototype.hasOwnProperty.call(pState.statemachine, "states")) {
        lReturnValue = lReturnValue.concat(
          // @ts-expect-error TS doesn't detect that after the call in the filter
          // the .statemachine is guaranteed to exist
          flattenStates(pState.statemachine.states, true),
        );
      }
    });

  return lReturnValue.concat(
    pStates.map((pState) => ({
      name: pState.name,
      type: pState.type,
      statemachine: Boolean(pState.statemachine),
      hasParent: pHasParent,
    })),
  );
}

function flattenTransitions(pStateMachine: IStateMachine): ITransition[] {
  /** @type {import("../types/state-machine-cat").ITransition[]} */
  let lTransitions: ITransition[] = [];

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
          flattenTransitions(pState.statemachine),
        );
      });
  }
  return lTransitions;
}

export default class StateMachineModel {
  private _flattenedTransitions: ITransition[];
  private _flattenedStates: any[];

  constructor(pStateMachine: IStateMachine) {
    this._flattenedStates = flattenStates(pStateMachine.states || []);
    this._flattenedTransitions = flattenTransitions(pStateMachine);
  }

  get flattenedTransitions(): ITransition[] {
    return this._flattenedTransitions;
  }

  findStateByName(pName: string): any {
    return this._flattenedStates.find((pState) => pState.name === pName);
  }

  findStatesByTypes(pTypes: StateType[]): any[] {
    return this._flattenedStates.filter((pState) =>
      pTypes.includes(pState.type),
    );
  }

  findExternalSelfTransitions(pStateName: string): ITransition[] {
    return this._flattenedTransitions.filter(
      (pTransition) =>
        pTransition.from === pStateName &&
        pTransition.to === pStateName &&
        pTransition.type !== "internal",
    );
  }

  findTransitionsByFrom(pFromStateName: string): ITransition[] {
    return this._flattenedTransitions.filter(
      (pTransition) => pTransition.from === pFromStateName,
    );
  }

  findTransitionsByTo(pToStateName: string): ITransition[] {
    return this._flattenedTransitions.filter(
      (pTransition) => pTransition.to === pToStateName,
    );
  }
}
