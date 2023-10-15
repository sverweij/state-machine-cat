import { equal } from "node:assert/strict";
import attributebuilder from "#render/dot/attributebuilder.mjs";

describe("attributebuilder ", () => {
  describe("buildGraphAttributes", () => {
    it("returns the generic attributes when no engine or direction is passed", () => {
      equal(
        attributebuilder.buildGraphAttributes(),
        'fontname="Helvetica" fontsize=12 penwidth=2.0',
      );
    });

    it("returns the generic attributes when an unknown engine is passed", () => {
      equal(
        attributebuilder.buildGraphAttributes("not a known engine"),
        'fontname="Helvetica" fontsize=12 penwidth=2.0',
      );
    });

    it("returns the generic attributes when an unknown engine and direction are passed", () => {
      equal(
        attributebuilder.buildGraphAttributes(
          "not a known engine",
          "diagon ally",
        ),
        'fontname="Helvetica" fontsize=12 penwidth=2.0',
      );
    });

    it("returns the fdp attributes when fdp is passed as an engine ", () => {
      equal(
        attributebuilder.buildGraphAttributes("fdp"),
        'fontname="Helvetica" fontsize=12 penwidth=2.0 K=0.9',
      );
    });

    it("returns a rankdir when passed left-right as a direction", () => {
      equal(
        attributebuilder.buildGraphAttributes(
          "not a known engine",
          "left-right",
        ),
        'fontname="Helvetica" fontsize=12 penwidth=2.0 rankdir=LR',
      );
    });

    it("appends graph attributes when these get passed", () => {
      equal(
        attributebuilder.buildGraphAttributes("not a known engine", null, [
          { name: "bgcolor", value: "pink" },
          { name: "ratio", value: 1 },
        ]),
        'fontname="Helvetica" fontsize=12 penwidth=2.0 bgcolor=pink ratio=1',
      );
    });
  });

  describe("buildNodeAttributes ", () => {
    it("returns the generic attributes nothing is passed", () => {
      equal(
        attributebuilder.buildNodeAttributes(),
        'shape=plaintext style=filled fillcolor="#FFFFFF01" fontname=Helvetica fontsize=12 penwidth=2.0',
      );
    });
    it("appends attributes when these are passed", () => {
      equal(
        attributebuilder.buildNodeAttributes([
          {
            name: "foo",
            value: "bar",
          },
        ]),
        'shape=plaintext style=filled fillcolor="#FFFFFF01" fontname=Helvetica fontsize=12 penwidth=2.0 foo=bar',
      );
    });
  });

  describe("buildEdgeAttributes ", () => {
    it("returns the generic attributes nothing is passed", () => {
      equal(
        attributebuilder.buildEdgeAttributes(),
        "fontname=Helvetica fontsize=10",
      );
    });
    it("appends attributes when these are passed", () => {
      equal(
        attributebuilder.buildEdgeAttributes([
          {
            name: "baz",
            value: "qux",
          },
        ]),
        "fontname=Helvetica fontsize=10 baz=qux",
      );
    });
  });
});
