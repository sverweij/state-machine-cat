
const expect  = require('chai').expect;
const massage = require('../../src/render/astMassage');
const pairs   = require("./astMassage.spec.json");

describe('#astMassage.isTransitionType', () => {
    it("happy day: the transition is of this one type", () => {
        expect(
            massage.isTransitionType(["regular"])({type:"regular"})
        ).to.be.true;
    });

    it("happy day: the transition is of one of these types", () => {
        expect(
            massage.isTransitionType(["spectacular", "regular"])({type:"regular"})
        ).to.be.true;
    });

    it("rainy day: the transition is not of this one type", () => {
        expect(
            massage.isTransitionType(["not in there"])({type:"regular"})
        ).to.be.false;
    });

    it("rainy day: the transition is not of any of these types", () => {
        expect(
            massage.isTransitionType(["not in there", "not in there either"])({type:"regular"})
        ).to.be.false;
    });

    it("rainy day: the transition doesn't have a type", () => {
        expect(
            massage.isTransitionType(["not in there", "not in there either"])({})
        ).to.be.false;
    });

    it("rainy day: [] matches nothing", () => {
        expect(
            massage.isTransitionType([])({type: "whatever"})
        ).to.be.false;
    });
});

describe('#astMassage.explode', () => {
    pairs.forEach(pPair => it(pPair.title, () => {
        expect(
            massage.explode(
                pPair.input.transitions,
                pPair.input.states
            )
        ).to.deep.equal(
            pPair.expectedOutput
        );
    }));
});

/* with chai things like expect(bla).to.be.something are used a lot */
/* eslint no-unused-expressions: 0 */
