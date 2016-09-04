// const path   = require('path');
const expect = require('chai').expect;
const norm   = require('../../src/cli/normalizations');

describe("#cli - normalize", () => {

    it("doesn't really know when presented with nothing", () => {
        expect(norm.normalize(null, {})).to.deep.equal({
            "inputFrom": undefined,
            "inputType": "stategenny",
            "outputTo": undefined,
            "outputType": "svg"
        });
    });

    it("generates defaults when presented with only standard input", () => {
        expect(norm.normalize("-", {outputTo: "-"})).to.deep.equal({
            "inputFrom": "-",
            "inputType": "stategenny",
            "outputTo": "-",
            "outputType": "svg"
        });
    });

    it("generates defaults when presented with only an (unclassifyable) input", () => {
        expect(norm.normalize("loopvogel", {})).to.deep.equal({
            "inputFrom": "loopvogel",
            "inputType": "stategenny",
            "outputTo": "loopvogel.svg",
            "outputType": "svg"
        });
    });

    it("generates defaults when presented with only a (classifyable) input", () => {
        expect(norm.normalize("loopvogel.stategenny", {})).to.deep.equal({
            "inputFrom": "loopvogel.stategenny",
            "inputType": "stategenny",
            "outputTo": "loopvogel.svg",
            "outputType": "svg"
        });
    });

    it("respects parameters - even when they're a bit weird", () => {
        expect(
            norm.normalize(
                "loopvogel.stategenny",
                {
                    outputTo: "somethingElse.dot",
                    outputType: "json"
                }
            )
        ).to.deep.equal({
            "inputFrom": "loopvogel.stategenny",
            "inputType": "stategenny",
            "outputTo": "somethingElse.dot",
            "outputType": "json"
        });
    });

    it("respects parameters - even when they're a bit weird", () => {
        expect(
            norm.normalize("-", {})
        ).to.deep.equal({
            "inputFrom": "-",
            "inputType": "stategenny",
            "outputTo": undefined,
            "outputType": "svg"
        });
    });

    it("takes input from from the --input-from parameter too", () => {
        expect(norm.normalize(null, {inputFrom: "eidereend.wak"})).to.deep.equal({
            "inputFrom": "eidereend.wak",
            "inputType": "stategenny",
            "outputTo": "eidereend.svg",
            "outputType": "svg"
        });
    });

});
/* eslint no-undefined: 0 */
