import { deepStrictEqual } from "node:assert";
import normalize from "../../src/cli/normalize.mjs";

describe("#cli - normalize [a]", () => {
  it("doesn't really know when presented with nothing", () => {
    deepStrictEqual(normalize(null, {}), {
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
    deepStrictEqual(normalize("-", { outputTo: "-" }), {
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
    deepStrictEqual(normalize("loopvogel", {}), {
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
    deepStrictEqual(normalize("loopvogel.smcat", {}), {
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
    deepStrictEqual(normalize("loopvogel.json", {}), {
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
    deepStrictEqual(normalize("loopvogel.djeezon", { inputType: "json" }), {
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
    });
  });

  it("respects parameters - even when they're a bit weird", () => {
    deepStrictEqual(
      normalize("loopvogel.smcat", {
        outputTo: "somethingElse.dot",
        outputType: "json",
      }),
      {
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
      },
    );
  });

  it("respects parameters - even when they're a bit sparse", () => {
    deepStrictEqual(normalize("-", {}), {
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
    deepStrictEqual(normalize("eidereend.wak", { engine: "neato" }), {
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
    deepStrictEqual(normalize("eidereend.wak", { direction: "left-right" }), {
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
    deepStrictEqual(
      normalize("eidereend.wak", { dotGraphAttrs: "mies=zus wim=jet" }),
      {
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
      },
    );
  });

  it("classifies the .scxml extension as scxml", () => {
    deepStrictEqual(normalize("model.scxml"), {
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
    deepStrictEqual(normalize("model.xml"), {
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
    deepStrictEqual(normalize("model.smcat", { outputType: "oldsvg" }), {
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
    deepStrictEqual(normalize(), {
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
