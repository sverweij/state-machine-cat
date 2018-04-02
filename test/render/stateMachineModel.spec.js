const expect  = require('chai').expect;
const SMModel = require('../../src/render/stateMachineModel');

describe('#StateMachineModel - findStateByName', () => {
    require("./astMassage-02-findStateByName.json")
        .forEach((pPair) => it(pPair.title, () => {
            const lSMModel = new SMModel(pPair.inputHaystack);
            expect(
                lSMModel.findStateByName(pPair.inputNeedle)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#StateMachineModel - flattenTransitions', () => {
    require("./astMassage-03-flattenTransitions.json")
        .forEach((pPair) => it(pPair.title, () => {
            const lSMModel = new SMModel(pPair.input);
            expect(
                lSMModel.flattenedTransitions
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

// describe('#astMassage - flattenStates', () => {
//     require("./astMassage-01-flattenStates.json")
//         .forEach((pPair) => it(pPair.title, () => {
//             expect(
//                 massage.flattenStates(pPair.input)
//             ).to.deep.equal(
//                 pPair.expectedOutput
//             );
//         }));
// });
