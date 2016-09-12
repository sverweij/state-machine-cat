const expect  = require('chai').expect;
const massage = require('../../src/render/astMassage');

describe('#astMassage', () => {
    require("./astMassage-01-flattenStates.json")
        .forEach(pPair => it(pPair.title, () => {
            expect(
                massage.flattenStates(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#astMassage', () => {
    require("./astMassage-02-findStateByName.json")
        .forEach(pPair => it(pPair.title, () => {
            expect(
                massage.findStateByName(pPair.inputNeedle)(pPair.inputHaystack)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});
