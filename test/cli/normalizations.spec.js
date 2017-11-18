"use strict";

const expect = require('chai').expect;
const norm   = require('../../src/cli/normalizations');

describe("#cli - normalize", () => {

    it("doesn't really know when presented with nothing", () => {
        expect(norm.normalize(null, {})).to.deep.equal({
            "inputFrom": undefined,
            "inputType": "smcat",
            "outputTo": undefined,
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

    it("respects parameters - even when they're a bit weird", () => {
        expect(
            norm.normalize("-", {})
        ).to.deep.equal({
            "inputFrom": "-",
            "inputType": "smcat",
            "outputTo": undefined,
            "outputType": "svg",
            "engine": "dot",
            "direction": "top-down"
        });
    });

    it("accepts and processes the 'engine' paramter", () => {
        expect(norm.normalize(null, {inputFrom: "eidereend.wak", engine: "neato"})).to.deep.equal({
            "inputFrom": "eidereend.wak",
            "inputType": "smcat",
            "outputTo": "eidereend.svg",
            "outputType": "svg",
            "engine": "neato",
            "direction": "top-down"
        });
    });

    it("accepts and processes the 'direction' paramter", () => {
        expect(norm.normalize(null, {inputFrom: "eidereend.wak", direction: "left-right"})).to.deep.equal({
            "inputFrom": "eidereend.wak",
            "inputType": "smcat",
            "outputTo": "eidereend.svg",
            "outputType": "svg",
            "engine": "dot",
            "direction": "left-right"
        });
    });

});
/* eslint no-undefined: 0 */
