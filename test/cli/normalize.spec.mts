import { deepEqual } from "node:assert/strict";
import normalize from "../../src/cli/normalize.mjs";

describe("#cli - normalize", () => {
  it("doesn't really know when presented with nothing", () => {
    deepEqual(normalize(null, {}), {
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
    deepEqual(normalize("-", { outputTo: "-" }), {
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
    deepEqual(normalize("loopvogel", {}), {
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
    deepEqual(normalize("loopvogel.smcat", {}), {
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
    deepEqual(normalize("loopvogel.json", {}), {
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
    deepEqual(normalize("loopvogel.djeezon", { inputType: "json" }), {
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
    deepEqual(
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
    deepEqual(normalize("-", {}), {
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
    deepEqual(normalize("eidereend.wak", { engine: "neato" }), {
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
    deepEqual(normalize("eidereend.wak", { direction: "left-right" }), {
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
    deepEqual(
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
    deepEqual(normalize("model.scxml"), {
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
    deepEqual(normalize("model.xml"), {
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
    deepEqual(normalize("model.smcat", { outputType: "oldsvg" }), {
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
    deepEqual(normalize(), {
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
