const expect  = require('chai').expect;
const massage = require('../../../src/render/dot/astMassage');

describe('#astMassage - flattenStates', () => {
    require("./astMassage-01-flattenStates.json")
        .forEach((pPair) => it(pPair.title, () => {
            expect(
                massage.flattenStates(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#astMassage - findStateByName', () => {
    require("./astMassage-02-findStateByName.json")
        .forEach((pPair) => it(pPair.title, () => {
            expect(
                massage.findStateByName(pPair.inputHaystack, pPair.inputNeedle)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#astMassage - flattenTransitions', () => {
    require("./astMassage-03-flattenTransitions.json")
        .forEach((pPair) => it(pPair.title, () => {
            expect(
                massage.flattenTransitions(pPair.input)
            ).to.deep.equal(
                pPair.expectedOutput
            );
        }));
});

describe('#astMassage - isType', () => {
    it('returns true if the object is of the passed type', () => {
        expect(
            massage.isType("initial")({name: "yeah baby", type: "initial"})
        ).to.equal(true);
    });

    it('returns false if the object is not of the passed type', () => {
        expect(
            massage.isType("final")({name: "no no no", type: "initial"})
        ).to.equal(false);
    });

    it("returns false if there's no type object at all in the object", () => {
        expect(
            massage.isType("final")({name: "only a name"})
        ).to.equal(false);
    });
});
