import { deepEqual } from "node:assert/strict";
import { createRequireJSON } from "./utl.mjs";
import SMModel from "#state-machine-model.mjs";

const requireJSON = createRequireJSON(import.meta.url);

describe("#StateMachineModel - findStateByName", () => {
  const lFindStateByNameTests = requireJSON(
    "./ast-massage-02-find-state-by-name.json",
  );

  for (const lPair of lFindStateByNameTests) {
    it(lPair.title, () => {
      const lSMModel = new SMModel(lPair.inputHaystack);

      deepEqual(
        lSMModel.findStateByName(lPair.inputNeedle),
        lPair.expectedOutput,
      );
    });
  }
});

describe("#StateMachineModel - flattenTransitions", () => {
  const lFlattenTransitionsTests = requireJSON(
    "./ast-massage-03-flatten-transitions.json",
  );

  for (const lPair of lFlattenTransitionsTests) {
    it(lPair.title, () => {
      const lSMModel = new SMModel(lPair.input);

      deepEqual(lSMModel.flattenedTransitions, lPair.expectedOutput);
    });
  }
});

describe("#astMassage - flattenStates", () => {
  const lFlattenStatesTests = requireJSON(
    "./ast-massage-01-flatten-states.json",
  );

  for (const lPair of lFlattenStatesTests) {
    it(lPair.title, () => {
      const lSMModel = new SMModel(lPair.input);
      const lFlattenedStatesMap = lSMModel.flattenedStates;
      const lFlattenedStatesArray = Array.from(lFlattenedStatesMap.values());
      deepEqual(lFlattenedStatesArray, lPair.expectedOutput);
    });
  }
});
