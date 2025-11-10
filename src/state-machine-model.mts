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

// eslint-disable-next-line complexity
function flattenStatesToMap(
  pStates: IState[],
  pMap: Map<string, IFlattenedState>,
  pParent: string = "",
): void {
  for (const lState of pStates) {
    if (lState?.statemachine?.states) {
      flattenStatesToMap(lState.statemachine.states, pMap, lState.name);
    }
  }

  for (const lState of pStates) {
    pMap.set(lState.name, {
      name: lState.name,
      type: lState.type,
      statemachine: Boolean(lState.statemachine),
      parent: pParent,
    });
  }
}

function flattenTransitions(pStateMachine: IStateMachine): ITransition[] {
  let lTransitions: ITransition[] = [];

  if (Object.hasOwn(pStateMachine, "transitions")) {
    // @ts-expect-error TS doesn't detect that after the call in the if the
    // .transitions is guaranteed to exist
    lTransitions = structuredClone(pStateMachine.transitions);
  }
  if (Object.hasOwn(pStateMachine, "states")) {
    for (const lState of pStateMachine.states) {
      if (lState.statemachine) {
        lTransitions = lTransitions.concat(
          flattenTransitions(lState.statemachine),
        );
      }
    }
  }

  return lTransitions;
}

export default class StateMachineModel {
  #flattenedTransitions: ITransition[];
  #flattenedStates: Map<string, IFlattenedState>;

  constructor(pStateMachine: IStateMachine) {
    this.#flattenedStates = new Map();
    flattenStatesToMap(pStateMachine.states ?? [], this.#flattenedStates);
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
