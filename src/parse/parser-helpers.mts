/* eslint-disable import/exports-last */
/* eslint-disable security/detect-object-injection */
import type {
  IState,
  IStateMachine,
  StateType,
} from "types/state-machine-cat.mjs";
import StateMachineModel from "../state-machine-model.mjs";

function stateExists(pKnownStateNames: string[], pName: string): boolean {
  return pKnownStateNames.includes(pName);
}

type RegExp2StateType = {
  re: RegExp;
  stateType: import("../../types/state-machine-cat.mjs").StateType;
};

const RE2STATE_TYPE: RegExp2StateType[] = [
  {
    re: /initial/,
    stateType: "initial",
  },
  {
    re: /final/,
    stateType: "final",
  },
  {
    re: /parallel/,
    stateType: "parallel",
  },
  {
    re: /(deep.*history)|(history.*deep)/,
    stateType: "deephistory",
  },
  {
    re: /history/,
    stateType: "history",
  },
  {
    re: /^\^.*/,
    stateType: "choice",
  },
  {
    re: /^].*/,
    stateType: "forkjoin",
  },
];

function matches(pName: string) {
  return (pEntry: RegExp2StateType): boolean => pEntry.re.test(pName);
}

export function getStateType(pName: string): StateType {
  return (RE2STATE_TYPE.find(matches(pName)) || { stateType: "regular" })
    .stateType;
}

export function initState(pName: string): IState {
  return {
    name: pName,
    type: getStateType(pName),
  };
}

function isComposite(pState: IState): boolean {
  return Boolean(pState.statemachine);
}

function getAlreadyDeclaredStates(pStateMachine: IStateMachine): string[] {
  const lStates = pStateMachine?.states ?? [];

  return lStates.filter(isComposite).reduce(
    (pAllStateNames, pThisState) =>
      pAllStateNames.concat(
        // cast: because of the isComposite, we now pThisState has a .statemachine
        // attribute and it won't be undefined
        getAlreadyDeclaredStates(pThisState.statemachine as IStateMachine),
      ),
    lStates.map(({ name }) => name),
  );
}

// eslint-disable-next-line complexity
export function extractUndeclaredStates(
  pStateMachine: IStateMachine,
  pKnownStateNames: string[],
): IState[] {
  pKnownStateNames =
    pKnownStateNames ?? getAlreadyDeclaredStates(pStateMachine);

  pStateMachine.states = pStateMachine?.states ?? [];
  const lTransitions = pStateMachine?.transitions ?? [];

  for (const lState of pStateMachine.states.filter(isComposite)) {
    // @ts-expect-error isComposite guarantees the statemachine attribute exists, TS doesn't understand that yet, though
    lState.statemachine.states = extractUndeclaredStates(
      // @ts-expect-error isComposite guarantees the statemachine attribute exists, TS doesn't understand that yet, though
      lState.statemachine,
      pKnownStateNames,
    );
  }

  for (const lTransition of lTransitions) {
    if (!stateExists(pKnownStateNames, lTransition.from)) {
      pKnownStateNames.push(lTransition.from);
      pStateMachine.states.push(initState(lTransition.from));
    }
    if (!stateExists(pKnownStateNames, lTransition.to)) {
      pKnownStateNames.push(lTransition.to);
      pStateMachine.states.push(initState(lTransition.to));
    }
  }
  return pStateMachine.states;
}

function classifyForkJoin(
  pInComingCount: number,
  pOutGoingCount: number,
): StateType {
  let lReturnValue: StateType = "junction";

  if (pInComingCount <= 1 && pOutGoingCount > 1) {
    lReturnValue = "fork";
  }
  if (pInComingCount > 1 && pOutGoingCount <= 1) {
    lReturnValue = "join";
  }

  return lReturnValue;
}

export function classifyForkJoins(
  pStateMachine: IStateMachine,
  pFlattenedStateMachineModel = new StateMachineModel(pStateMachine),
): IStateMachine {
  // TODO: mutates parameter
  pStateMachine.states = pStateMachine.states.map((pState) => {
    if (pState.type === "forkjoin" && !pState.typeExplicitlySet) {
      const lInComingCount = pFlattenedStateMachineModel.findTransitionsByTo(
        pState.name,
      ).length;
      const lOutGoingCount = pFlattenedStateMachineModel.findTransitionsByFrom(
        pState.name,
      ).length;

      pState.type = classifyForkJoin(lInComingCount, lOutGoingCount);
    }
    if (pState.statemachine) {
      pState.statemachine = classifyForkJoins(
        pState.statemachine,
        pFlattenedStateMachineModel,
      );
    }
    return pState;
  });

  return pStateMachine;
}

export function stateEqual(pStateOne: IState, pStateTwo: IState): boolean {
  return pStateOne.name === pStateTwo.name;
}

export function uniq<SomeType>(
  pArray: Array<SomeType>,
  pEqualFunction: (a: SomeType, b: SomeType) => boolean,
) {
  return pArray.reduce((pBag: SomeType[], pMarble: SomeType) => {
    const lMarbleIndex = pBag.findIndex((pBagItem) =>
      pEqualFunction(pBagItem, pMarble),
    );

    if (lMarbleIndex > -1) {
      // ensures the _last_ marble we find is in the bag on that position
      pBag[lMarbleIndex] = pMarble;
      return pBag;
    }
    return pBag.concat(pMarble);
  }, []);
}

// to prevent ReDoS alerts in security scanners (=> as this is executed on the
// client or the cli the risk is _very_ small), we limit the lengths of the parts
// we capture.
const TRANSITION_EXPRESSION_RE =
  // eslint-disable-next-line security/detect-unsafe-regex
  /(?<event>[^[/]{1,256})?(?<condition>\[[^\]]{1,256}\])?[^/]{0,100}(?<action>\/.{1,2048})?/;

export function parseTransitionExpression(pString: string): {
  event?: string;
  cond?: string;
  action?: string;
} {
  const lReturnValue: { event?: string; cond?: string; action?: string } = {};
  const lMatch: RegExpMatchArray | null =
    TRANSITION_EXPRESSION_RE.exec(pString);

  if (lMatch?.groups) {
    if (lMatch.groups.event) {
      lReturnValue.event = lMatch.groups.event.trim();
    }
    if (lMatch.groups.condition) {
      lReturnValue.cond = lMatch.groups.condition.slice(1, -1).trim();
    }
    if (lMatch.groups.action) {
      lReturnValue.action = lMatch.groups.action
        .slice(1, lMatch.groups.action.length)
        .trim();
    }
  }

  return lReturnValue;
}

export function setIf(
  pObject: { [name: string]: string },
  pProperty: string,
  pValue: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pCondition: (pX: any) => boolean = Boolean,
) {
  if (pCondition(pValue)) {
    pObject[pProperty] = pValue;
  }
}

export function setIfNotEmpty(
  pObject: { [name: string]: string },
  pProperty: string,
  pValue: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setIf(pObject, pProperty, pValue, (pX: Array<any>) => pX && pX.length > 0);
}

// to prevent ReDoS alerts in security scanners (=> as this is executed on the
// client or the cli the risk is _very_ small), we limit the lengths of the parts
// we capture
const TRIGGER_RE =
  /^(?<triggerType>entry|activity|exit)\s{0,100}\/\s{0,100}(?<triggerBody>[^\n$]{0,2048})(?:\n|$)/;

function extractAction(pActivityCandidate: string): {
  type: string;
  body: string;
} {
  const lReturnValue = { type: "activity", body: pActivityCandidate };
  const lMatch: RegExpMatchArray | null = TRIGGER_RE.exec(pActivityCandidate);

  if (lMatch?.groups) {
    lReturnValue.type = lMatch.groups.triggerType;
    lReturnValue.body = lMatch.groups.triggerBody;
  }

  return lReturnValue;
}

export function extractActions(
  pString: string,
): { type: string; body: string }[] {
  return pString
    .split(/\n\s*/g)
    .map((pActivityCandidate) => pActivityCandidate.trim())
    .map(extractAction);
}
