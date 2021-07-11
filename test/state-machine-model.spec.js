import { expect } from "chai";
import SMModel from "../src/state-machine-model.js";
import { createRequireJSON } from "./utl.js";

const requireJSON = createRequireJSON(import.meta.url);

describe("#StateMachineModel - findStateByName", () => {
  requireJSON("./ast-massage-02-find-state-by-name.json").forEach((pPair) =>
    it(pPair.title, () => {
      const lSMModel = new SMModel(pPair.inputHaystack);

      expect(lSMModel.findStateByName(pPair.inputNeedle)).to.deep.equal(
        pPair.expectedOutput
      );
    })
  );
});

describe("#StateMachineModel - flattenTransitions", () => {
  requireJSON("./ast-massage-03-flatten-transitions.json").forEach((pPair) =>
    it(pPair.title, () => {
      const lSMModel = new SMModel(pPair.input);

      expect(lSMModel.flattenedTransitions).to.deep.equal(pPair.expectedOutput);
    })
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
