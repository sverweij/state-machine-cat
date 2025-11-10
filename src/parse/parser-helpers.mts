/* eslint-disable security/detect-object-injection */
import type {
  IState,
  IStateMachine,
  StateType,
} from "types/state-machine-cat.mjs";
import StateMachineModel from "../state-machine-model.mjs";

const TRIGGER_RE_AS_A_STRING =
  "^(entry|activity|exit)\\s*/\\s*([^\\n$]*)(\\n|$)";
/* eslint security/detect-non-literal-regexp:0 */
const TRIGGER_RE = new RegExp(TRIGGER_RE_AS_A_STRING);

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

function getStateType(pName: string): StateType {
  return (RE2STATE_TYPE.find(matches(pName)) || { stateType: "regular" })
    .stateType;
}

function initState(pName: string): IState {
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
function extractUndeclaredStates(
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

function classifyForkJoins(
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

function stateEqual(pStateOne: IState, pStateTwo: IState): boolean {
  return pStateOne.name === pStateTwo.name;
}

function uniq<SomeType>(
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

function parseTransitionExpression(pString: string): {
  event?: string;
  cond?: string;
  action?: string;
} {
  // eslint-disable-next-line security/detect-unsafe-regex
  const lTransitionExpressionRe = /([^[/]+)?(\[[^\]]+\])?[^/]*(\/.+)?/;
  const lReturnValue: { event?: string; cond?: string; action?: string } = {};

  // @ts-expect-error match has no fallback because lTransitionExpressionRe will match
  // any string (every part is optional)
  const lMatchResult: RegExpMatchArray = lTransitionExpressionRe.exec(pString);
  const lEventPos = 1;
  const lConditionPos = 2;
  const lActionPos = 3;

  if (lMatchResult[lEventPos]) {
    lReturnValue.event = lMatchResult[lEventPos].trim();
  }
  if (lMatchResult[lConditionPos]) {
    lReturnValue.cond = lMatchResult[lConditionPos].slice(1, -1).trim();
  }
  if (lMatchResult[lActionPos]) {
    lReturnValue.action = lMatchResult[lActionPos]
      .slice(1, lMatchResult[lActionPos].length)
      .trim();
  }

  return lReturnValue;
}

function setIf(
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

function setIfNotEmpty(
  pObject: { [name: string]: string },
  pProperty: string,
  pValue: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setIf(pObject, pProperty, pValue, (pX: Array<any>) => pX && pX.length > 0);
}

function extractAction(pActivityCandidate: string): {
  type: string;
  body: string;
} {
  const lMatch = TRIGGER_RE.exec(pActivityCandidate);
  const lTypePos = 1;
  const lBodyPos = 2;

  if (lMatch) {
    return {
      type: lMatch[lTypePos],
      body: lMatch[lBodyPos],
    };
  }
  return {
    type: "activity",
    body: pActivityCandidate,
  };
}

function extractActions(pString: string): { type: string; body: string }[] {
  return pString
    .split(/\n\s*/g)
    .map((pActivityCandidate) => pActivityCandidate.trim())
    .map(extractAction);
}

export default {
  initState,
  extractUndeclaredStates,
  classifyForkJoins,
  getStateType,
  stateEqual,
  uniq,
  parseTransitionExpression,
  extractActions,
  setIf,
  setIfNotEmpty,
};
