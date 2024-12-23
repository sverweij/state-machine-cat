/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IState,
  IStateMachine,
  ITransition,
  StateType,
} from "types/state-machine-cat.mjs";

interface IFlattenedState extends Omit<IState, "statemachine"> {
  statemachine: boolean;
  parent: string;
}

function flattenStatesToMap(
  pStates: IState[],
  pMap: Map<string, IFlattenedState>,
  pParent: string = "",
): void {
  pStates
    .filter((pState) => Boolean(pState.statemachine))
    .forEach((pState) => {
      // @ts-expect-error ts2345 - typescript doesn't detect that one line above we
      // ensure pState.statemachine is not undefined
      if (Object.hasOwn(pState.statemachine, "states")) {
        // @ts-expect-error TS doesn't detect that after the call in the filter
        // the .statemachine is guaranteed to exist
        flattenStatesToMap(pState.statemachine.states, pMap, pState.name);
      }
    });

  pStates.forEach((pState) =>
    pMap.set(pState.name, {
      name: pState.name,
      type: pState.type,
      statemachine: Boolean(pState.statemachine),
      parent: pParent,
    }),
  );
}

function flattenTransitions(pStateMachine: IStateMachine): ITransition[] {
  /** @type {import("../types/state-machine-cat").ITransition[]} */
  let lTransitions: ITransition[] = [];

  if (Object.hasOwn(pStateMachine, "transitions")) {
    // @ts-expect-error TS doesn't detect that after the call in the if the
    // .transitions is guaranteed to exist
    lTransitions = structuredClone(pStateMachine.transitions);
  }
  if (Object.hasOwn(pStateMachine, "states")) {
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
  private _flattenedStates: Map<string, IFlattenedState>;

  constructor(pStateMachine: IStateMachine) {
    this._flattenedStates = new Map();
    flattenStatesToMap(pStateMachine.states ?? [], this._flattenedStates);
    this._flattenedTransitions = flattenTransitions(pStateMachine);
  }

  get flattenedTransitions(): ITransition[] {
    return this._flattenedTransitions;
  }

  findStateByName(pName: string): IFlattenedState | undefined {
    return this._flattenedStates.get(pName);
  }

  findStatesByTypes(pTypes: StateType[]): any[] {
    return Array.from(this._flattenedStates.values()).filter((pState) =>
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

  findTransitionsByFromWithSameParent(
    pStateName: string,
    pExcludeIds: Set<number>,
  ): ITransition[] {
    return this._flattenedTransitions.filter(
      (pTransition) =>
        !pExcludeIds.has(pTransition.id) &&
        pTransition.from === pStateName &&
        this.findStateByName(pTransition.to)?.parent ===
          this.findStateByName(pStateName)?.parent,
    );
  }
}
