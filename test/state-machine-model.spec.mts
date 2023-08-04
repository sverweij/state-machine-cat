import { deepStrictEqual } from "node:assert";
import SMModel from "../src/state-machine-model.mjs";
import { createRequireJSON } from "./utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

describe("#StateMachineModel - findStateByName", () => {
  requireJSON("./ast-massage-02-find-state-by-name.json").forEach((pPair) =>
    it(pPair.title, () => {
      const lSMModel = new SMModel(pPair.inputHaystack);

      deepStrictEqual(
        lSMModel.findStateByName(pPair.inputNeedle),
        pPair.expectedOutput,
      );
    }),
  );
});

describe("#StateMachineModel - flattenTransitions", () => {
  requireJSON("./ast-massage-03-flatten-transitions.json").forEach((pPair) =>
    it(pPair.title, () => {
      const lSMModel = new SMModel(pPair.input);

      deepStrictEqual(lSMModel.flattenedTransitions, pPair.expectedOutput);
    }),
  );
});

// describe('#astMassage - flattenStates', () => {
//     require("./ast-massage-01-flatten-states.json")
//         .forEach((pPair) => it(pPair.title, () => {
//             expect(
//                 massage.flattenStates(pPair.input)
//             ).to.deep.equal(
//                 pPair.expectedOutput
//             );
//         }));
// });
