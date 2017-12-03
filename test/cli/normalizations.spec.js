const expect = require('chai').expect;
const norm   = require('../../src/cli/normalizations');

describe("#cli - normalize", () => {

    it("doesn't really know when presented with nothing", () => {
        expect(norm.normalize(null, {})).to.deep.equal({
            "inputFrom": "-",
            "inputType": "smcat",
            "outputTo": "-",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down"
        });
    });

    it("generates defaults when presented with only standard input", () => {
        expect(norm.normalize("-", {outputTo: "-"})).to.deep.equal({
            "inputFrom": "-",
            "inputType": "smcat",
            "outputTo": "-",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down"
        });
    });

    it("generates defaults when presented with only an (unclassifyable) input", () => {
        expect(norm.normalize("loopvogel", {})).to.deep.equal({
            "inputFrom": "loopvogel",
            "inputType": "smcat",
            "outputTo": "loopvogel.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down"
        });
    });

    it("generates defaults when presented with only a (classifyable) input", () => {
        expect(norm.normalize("loopvogel.smcat", {})).to.deep.equal({
            "inputFrom": "loopvogel.smcat",
            "inputType": "smcat",
            "outputTo": "loopvogel.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down"
        });
    });

    it("generates defaults when presented with only a (classifyable; json) input", () => {
        expect(norm.normalize("loopvogel.json", {})).to.deep.equal({
            "inputFrom": "loopvogel.json",
            "inputType": "json",
            "outputTo": "loopvogel.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down"
        });
    });

    it("respects parameters - even when they're a bit weird", () => {
        expect(
            norm.normalize(
                "loopvogel.smcat",
                {
                    outputTo: "somethingElse.dot",
                    outputType: "json"
                }
            )
        ).to.deep.equal({
            "inputFrom": "loopvogel.smcat",
            "inputType": "smcat",
            "outputTo": "somethingElse.dot",
            "outputType": "json",
            "engine": "dot",
            "direction": "top-down"
        });
    });

    it("respects parameters - even when they're a bit sparse", () => {
        expect(
            norm.normalize("-", {})
        ).to.deep.equal({
            "inputFrom": "-",
            "inputType": "smcat",
            "outputTo": "-",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down"
        });
    });

    it("accepts and processes the 'engine' parameter", () => {
        expect(norm.normalize("eidereend.wak", {engine: "neato"})).to.deep.equal({
            "inputFrom": "eidereend.wak",
            "inputType": "smcat",
            "outputTo": "eidereend.svg",
            "outputType": "svg",
            "engine": "neato",
            "direction": "top-down"
        });
    });

    it("accepts and processes the 'direction' parameter", () => {
        expect(norm.normalize("eidereend.wak", {direction: "left-right"})).to.deep.equal({
            "inputFrom": "eidereend.wak",
            "inputType": "smcat",
            "outputTo": "eidereend.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "left-right"
        });
    });

    it("handles unspecified everything", () => {
        expect(norm.normalize()).to.deep.equal({
            "inputFrom": "-",
            "inputType": "smcat",
            "outputTo": "-",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down"
        });
    });

});
/* eslint no-undefined: 0 */
