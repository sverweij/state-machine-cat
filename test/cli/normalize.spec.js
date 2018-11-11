const expect    = require('chai').expect;
const normalize = require('../../src/cli/normalize');

describe("#cli - normalize", () => {

    it("doesn't really know when presented with nothing", () => {
        expect(normalize(null, {})).to.deep.equal({
            "inputFrom": "-",
            "inputType": "smcat",
            "outputTo": "-",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("generates defaults when presented with only standard input", () => {
        expect(normalize("-", {outputTo: "-"})).to.deep.equal({
            "inputFrom": "-",
            "inputType": "smcat",
            "outputTo": "-",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("generates defaults when presented with only an (unclassifyable) input", () => {
        expect(normalize("loopvogel", {})).to.deep.equal({
            "inputFrom": "loopvogel",
            "inputType": "smcat",
            "outputTo": "loopvogel.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("generates defaults when presented with only a (classifyable) input", () => {
        expect(normalize("loopvogel.smcat", {})).to.deep.equal({
            "inputFrom": "loopvogel.smcat",
            "inputType": "smcat",
            "outputTo": "loopvogel.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("generates defaults when presented with only a (classifyable; json) input", () => {
        expect(normalize("loopvogel.json", {})).to.deep.equal({
            "inputFrom": "loopvogel.json",
            "inputType": "json",
            "outputTo": "loopvogel.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("respects parameters - even when they're a bit weird", () => {
        expect(
            normalize(
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
            "direction": "top-down",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("respects parameters - even when they're a bit sparse", () => {
        expect(
            normalize("-", {})
        ).to.deep.equal({
            "inputFrom": "-",
            "inputType": "smcat",
            "outputTo": "-",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("accepts and processes the 'engine' parameter", () => {
        expect(normalize("eidereend.wak", {engine: "neato"})).to.deep.equal({
            "inputFrom": "eidereend.wak",
            "inputType": "smcat",
            "outputTo": "eidereend.svg",
            "outputType": "svg",
            "engine": "neato",
            "direction": "top-down",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("accepts and processes the 'direction' parameter", () => {
        expect(normalize("eidereend.wak", {direction: "left-right"})).to.deep.equal({
            "inputFrom": "eidereend.wak",
            "inputType": "smcat",
            "outputTo": "eidereend.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "left-right",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("accepts and processes the 'dotGraphAttrs' parameter", () => {
        expect(normalize("eidereend.wak", {dotGraphAttrs: "mies=zus wim=jet"})).to.deep.equal({
            "inputFrom": "eidereend.wak",
            "inputType": "smcat",
            "outputTo": "eidereend.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down",
            "dotGraphAttrs": [{
                name: "mies",
                value: "zus"
            }, {
                name: "wim",
                value: "jet"
            }],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

    it("handles unspecified everything", () => {
        expect(normalize()).to.deep.equal({
            "inputFrom": "-",
            "inputType": "smcat",
            "outputTo": "-",
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down",
            "dotGraphAttrs": [],
            "dotNodeAttrs": [],
            "dotEdgeAttrs": []
        });
    });

});
/* eslint no-undefined: 0 */
