import { expect } from "chai";
import normalize from "../../src/cli/normalize.mjs";

describe("#cli - normalize", () => {
  it("doesn't really know when presented with nothing", () => {
    expect(normalize(null, {})).to.deep.equal({
      inputFrom: "-",
      inputType: "smcat",
      outputTo: "-",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("generates defaults when presented with only standard input", () => {
    expect(normalize("-", { outputTo: "-" })).to.deep.equal({
      inputFrom: "-",
      inputType: "smcat",
      outputTo: "-",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("generates defaults when presented with only an (unclassifyable) input", () => {
    expect(normalize("loopvogel", {})).to.deep.equal({
      inputFrom: "loopvogel",
      inputType: "smcat",
      outputTo: "loopvogel.svg",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("generates defaults when presented with only a (classifyable) input", () => {
    expect(normalize("loopvogel.smcat", {})).to.deep.equal({
      inputFrom: "loopvogel.smcat",
      inputType: "smcat",
      outputTo: "loopvogel.svg",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("generates defaults when presented with only a (classifyable; json) input", () => {
    expect(normalize("loopvogel.json", {})).to.deep.equal({
      inputFrom: "loopvogel.json",
      inputType: "json",
      outputTo: "loopvogel.svg",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("generates defaults when presented with only a hard input type (json)", () => {
    expect(normalize("loopvogel.djeezon", { inputType: "json" })).to.deep.equal(
      {
        inputFrom: "loopvogel.djeezon",
        inputType: "json",
        outputTo: "loopvogel.svg",
        outputType: "svg",
        engine: "dot",
        direction: "top-down",
        dotGraphAttrs: [],
        dotNodeAttrs: [],
        dotEdgeAttrs: [],
        desugar: false,
      }
    );
  });

  it("respects parameters - even when they're a bit weird", () => {
    expect(
      normalize("loopvogel.smcat", {
        outputTo: "somethingElse.dot",
        outputType: "json",
      })
    ).to.deep.equal({
      inputFrom: "loopvogel.smcat",
      inputType: "smcat",
      outputTo: "somethingElse.dot",
      outputType: "json",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("respects parameters - even when they're a bit sparse", () => {
    expect(normalize("-", {})).to.deep.equal({
      inputFrom: "-",
      inputType: "smcat",
      outputTo: "-",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("accepts and processes the 'engine' parameter", () => {
    expect(normalize("eidereend.wak", { engine: "neato" })).to.deep.equal({
      inputFrom: "eidereend.wak",
      inputType: "smcat",
      outputTo: "eidereend.svg",
      outputType: "svg",
      engine: "neato",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("accepts and processes the 'direction' parameter", () => {
    expect(
      normalize("eidereend.wak", { direction: "left-right" })
    ).to.deep.equal({
      inputFrom: "eidereend.wak",
      inputType: "smcat",
      outputTo: "eidereend.svg",
      outputType: "svg",
      engine: "dot",
      direction: "left-right",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("accepts and processes the 'dotGraphAttrs' parameter", () => {
    expect(
      normalize("eidereend.wak", { dotGraphAttrs: "mies=zus wim=jet" })
    ).to.deep.equal({
      inputFrom: "eidereend.wak",
      inputType: "smcat",
      outputTo: "eidereend.svg",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [
        {
          name: "mies",
          value: "zus",
        },
        {
          name: "wim",
          value: "jet",
        },
      ],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("classifies the .scxml extension as scxml", () => {
    expect(normalize("model.scxml")).to.deep.equal({
      inputFrom: "model.scxml",
      inputType: "scxml",
      outputTo: "model.svg",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("classifies the .xml extension as scxml", () => {
    expect(normalize("model.xml")).to.deep.equal({
      inputFrom: "model.xml",
      inputType: "scxml",
      outputTo: "model.svg",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("appends .svg for outputType oldsvg", () => {
    expect(normalize("model.smcat", { outputType: "oldsvg" })).to.deep.equal({
      inputFrom: "model.smcat",
      inputType: "smcat",
      outputTo: "model.svg",
      outputType: "oldsvg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });

  it("handles unspecified everything", () => {
    expect(normalize()).to.deep.equal({
      inputFrom: "-",
      inputType: "smcat",
      outputTo: "-",
      outputType: "svg",
      engine: "dot",
      direction: "top-down",
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
      desugar: false,
    });
  });
});
/* eslint no-undefined: 0 */
