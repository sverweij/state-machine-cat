/* eslint-disable security/detect-object-injection */
const StateMachineModel = require("../state-machine-model");

const TRIGGER_RE_AS_A_STRING =
  "^(entry|activity|exit)\\s*/\\s*([^\\n$]*)(\\n|$)";
/* eslint security/detect-non-literal-regexp:0 */
const TRIGGER_RE = new RegExp(TRIGGER_RE_AS_A_STRING);

function stateExists(pKnownStateNames, pName) {
  return pKnownStateNames.includes(pName);
}

const RE2STATE_TYPE = [
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

function matches(pName) {
  return (pEntry) => pEntry.re.test(pName);
}

function getStateType(pName) {
  return (RE2STATE_TYPE.find(matches(pName)) || { stateType: "regular" })
    .stateType;
}

function initState(pName) {
  return {
    name: pName,
    type: getStateType(pName),
  };
}

function isComposite(pState) {
  return Boolean(pState.statemachine);
}

function getAlreadyDeclaredStates(pStateMachine) {
  const lStates = pStateMachine.states || [];

  return lStates.filter(isComposite).reduce(
    (pAllStateNames, pThisState) =>
      pAllStateNames.concat(getAlreadyDeclaredStates(pThisState.statemachine)),
    lStates.map((pState) => pState.name)
  );
}

function extractUndeclaredStates(pStateMachine, pKnownStateNames) {
  pKnownStateNames = pKnownStateNames
    ? pKnownStateNames
    : getAlreadyDeclaredStates(pStateMachine);

  pStateMachine.states = pStateMachine.states || [];
  const lTransitions = pStateMachine.transitions || [];

  pStateMachine.states.filter(isComposite).forEach((pState) => {
    pState.statemachine.states = extractUndeclaredStates(
      pState.statemachine,
      pKnownStateNames
    );
  });

  lTransitions.forEach((pTransition) => {
    if (!stateExists(pKnownStateNames, pTransition.from)) {
      pKnownStateNames.push(pTransition.from);
      pStateMachine.states.push(initState(pTransition.from));
    }
    if (!stateExists(pKnownStateNames, pTransition.to)) {
      pKnownStateNames.push(pTransition.to);
      pStateMachine.states.push(initState(pTransition.to));
    }
  });
  return pStateMachine.states;
}

function classifyForkJoin(pInComingCount, pOutGoingCount) {
  let lReturnValue = "junction";

  if (pInComingCount <= 1 && pOutGoingCount > 1) {
    lReturnValue = "fork";
  }
  if (pInComingCount > 1 && pOutGoingCount <= 1) {
    lReturnValue = "join";
  }

  return lReturnValue;
}

function classifyForkJoins(
  pStateMachine,
  pFlattenedStateMachineModel = new StateMachineModel(pStateMachine)
) {
  pStateMachine.states = pStateMachine.states.map((pState) => {
    if (pState.type === "forkjoin" && !pState.typeExplicitlySet) {
      const lInComingCount = pFlattenedStateMachineModel.findTransitionsByTo(
        pState.name
      ).length;
      const lOutGoingCount = pFlattenedStateMachineModel.findTransitionsByFrom(
        pState.name
      ).length;

      pState.type = classifyForkJoin(lInComingCount, lOutGoingCount);
    }
    if (pState.statemachine) {
      pState.statemachine = classifyForkJoins(
        pState.statemachine,
        pFlattenedStateMachineModel
      );
    }
    return pState;
  });

  return pStateMachine;
}

function stateEqual(pStateOne, pStateTwo) {
  return pStateOne.name === pStateTwo.name;
}

function uniq(pArray, pEqualFunction) {
  return pArray.reduce((pBag, pMarble) => {
    const lMarbleIndex = pBag.findIndex((pBagItem) =>
      pEqualFunction(pBagItem, pMarble)
    );

    if (lMarbleIndex > -1) {
      // ensures the _last_ marble we find is in the bag on that position
      pBag[lMarbleIndex] = pMarble;
      return pBag;
    }
    return pBag.concat(pMarble);
  }, []);
}

function parseTransitionExpression(pString) {
  // eslint-disable-next-line security/detect-unsafe-regex, unicorn/no-unsafe-regex
  const lTransitionExpressionRe = /([^[/]+)?(\[[^\]]+\])?[^/]*(\/.+)?/;
  const lReturnValue = {};

  // match has no fallback because lTransitionExpressionRe will match
  // any string (every part is optional)
  const lMatchResult = pString.match(lTransitionExpressionRe);
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

function setIf(pObject, pProperty, pValue, pCondition = (pX) => pX) {
  if (pCondition(pValue)) {
    pObject[pProperty] = pValue;
  }
}

function setIfNotEmpty(pObject, pProperty, pValue) {
  setIf(pObject, pProperty, pValue, (pX) => pX && pX.length > 0);
}

function extractAction(pActivityCandidate) {
  const lMatch = pActivityCandidate.match(TRIGGER_RE);
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

function extractActions(pString) {
  return pString
    .split(/\n\s*/g)
    .map((pActivityCandidate) => pActivityCandidate.trim())
    .map(extractAction);
}

module.exports = {
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
