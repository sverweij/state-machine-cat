const expect  = require('chai').expect;
const massage = require('../../src/render/astMassage');

describe('#astMassage - flattenStates', () => {
    require("./astMassage-01-flattenStates.json")
        .forEach(pPair => it(pPair.title, () => {
            expect(
                massage.flattenStates(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#astMassage - findStateByName', () => {
    require("./astMassage-02-findStateByName.json")
        .forEach(pPair => it(pPair.title, () => {
            expect(
                massage.findStateByName(pPair.inputNeedle)(pPair.inputHaystack)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#astMassage - flattenTransitions', () => {
    require("./astMassage-03-flattenTransitions.json")
        .forEach(pPair => it(pPair.title, () => {
            expect(
                massage.flattenTransitions(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});
