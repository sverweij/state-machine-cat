const expect  = require('chai').expect;
const graphattributebuilder = require('../../../src/render/dot/graphattributebuilder');

describe("graphattributebuilder", () => {
    it("returns the generic attributes when no engine or direction is passed", () => {
        expect(
            graphattributebuilder()
        ).to.equal(
            'fontname="Helvetica" fontsize=12 penwidth=2.0'
        );
    });

    it("returns the generic attributes when an unknown engine is passed", () => {
        expect(
            graphattributebuilder('not a known engine')
        ).to.equal(
            'fontname="Helvetica" fontsize=12 penwidth=2.0'
        );
    });

    it("returns the generic attributes when an unknown engine and direction are passed", () => {
        expect(
            graphattributebuilder('not a known engine', 'diagon ally')
        ).to.equal(
            'fontname="Helvetica" fontsize=12 penwidth=2.0'
        );
    });

    it("returns the fdp attributes when fdp is passed as an engine ", () => {
        expect(
            graphattributebuilder('fdp')
        ).to.equal(
            'fontname="Helvetica" fontsize=12 penwidth=2.0 K=0.9'
        );
    });

    it("returns a rankdir when passed left-right as a direction", () => {
        expect(
            graphattributebuilder('not a known engine', 'left-right')
        ).to.equal(
            'fontname="Helvetica" fontsize=12 penwidth=2.0 rankdir=LR'
        );
    });
});
