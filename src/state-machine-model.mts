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
  pMap: Map<string, IFlattenedState> = new Map<string, IFlattenedState>(),
  pParent: string = "",
): Map<string, IFlattenedState> {
  let lMap = pMap;

  pStates
    .filter((pState) => Boolean(pState.statemachine))
    .forEach((pState) => {
      // @ts-expect-error ts2345 - typescript doesn't detect that one line above we
      // ensure pState.statemachine is not undefined
      if (Object.hasOwn(pState.statemachine, "states")) {
        lMap = flattenStatesToMap(
          // @ts-expect-error TS doesn't detect that after the call in the filter
          // the .statemachine is guaranteed to exist
          pState.statemachine.states,
          pMap,
          pState.name,
        );
      }
    });

  pStates.forEach((pState) =>
    lMap.set(pState.name, {
      name: pState.name,
      type: pState.type,
      statemachine: Boolean(pState.statemachine),
      parent: pParent,
    }),
  );
  return lMap;
}

function flattenTransitions(pStateMachine: IStateMachine): ITransition[] {
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
  #flattenedStates: Map<string, IFlattenedState>;
  #flattenedTransitions: ITransition[];

  constructor(pStateMachine: IStateMachine) {
    this.#flattenedStates = flattenStatesToMap(pStateMachine.states ?? []);
    this.#flattenedTransitions = flattenTransitions(pStateMachine);
  }

  get flattenedTransitions(): ITransition[] {
    return this.#flattenedTransitions;
  }

  findStateByName(pName: string): IFlattenedState | undefined {
    return this.#flattenedStates.get(pName);
  }

  findStatesByTypes(pTypes: StateType[]): any[] {
    return Array.from(this.#flattenedStates.values()).filter((pState) =>
      pTypes.includes(pState.type),
    );
  }

  findExternalSelfTransitions(pStateName: string): ITransition[] {
    return this.#flattenedTransitions.filter(
      (pTransition) =>
        pTransition.from === pStateName &&
        pTransition.to === pStateName &&
        pTransition.type !== "internal",
    );
  }

  findTransitionsByFrom(pFromStateName: string): ITransition[] {
    return this.#flattenedTransitions.filter(
      (pTransition) => pTransition.from === pFromStateName,
    );
  }

  findTransitionsByTo(pToStateName: string): ITransition[] {
    return this.#flattenedTransitions.filter(
      (pTransition) => pTransition.to === pToStateName,
    );
  }

  getMaximumTransitionId(): number {
    return Math.max(...this.#flattenedTransitions.map(({ id }) => id));
  }

  findTransitionsToSiblings(
    pStateName: string,
    pExcludeIds: Set<number>,
  ): ITransition[] {
    return this.#flattenedTransitions.filter(
      (pTransition) =>
        !pExcludeIds.has(pTransition.id) &&
        pTransition.from === pStateName &&
        this.#flattenedStates.get(pTransition.to)?.parent ===
          this.#flattenedStates.get(pStateName)?.parent,
    );
  }
}
