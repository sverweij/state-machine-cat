import { expect } from "chai";
import attributebuilder from "../../../src/render/dot/attributebuilder.mjs";

describe("attributebuilder", () => {
  describe("buildGraphAttributes", () => {
    it("returns the generic attributes when no engine or direction is passed", () => {
      expect(attributebuilder.buildGraphAttributes()).to.equal(
        'fontname="Helvetica" fontsize=12 penwidth=2.0'
      );
    });

    it("returns the generic attributes when an unknown engine is passed", () => {
      expect(
        attributebuilder.buildGraphAttributes("not a known engine")
      ).to.equal('fontname="Helvetica" fontsize=12 penwidth=2.0');
    });

    it("returns the generic attributes when an unknown engine and direction are passed", () => {
      expect(
        attributebuilder.buildGraphAttributes(
          "not a known engine",
          "diagon ally"
        )
      ).to.equal('fontname="Helvetica" fontsize=12 penwidth=2.0');
    });

    it("returns the fdp attributes when fdp is passed as an engine ", () => {
      expect(attributebuilder.buildGraphAttributes("fdp")).to.equal(
        'fontname="Helvetica" fontsize=12 penwidth=2.0 K=0.9'
      );
    });

    it("returns a rankdir when passed left-right as a direction", () => {
      expect(
        attributebuilder.buildGraphAttributes(
          "not a known engine",
          "left-right"
        )
      ).to.equal('fontname="Helvetica" fontsize=12 penwidth=2.0 rankdir=LR');
    });

    it("appends graph attributes when these get passed", () => {
      expect(
        attributebuilder.buildGraphAttributes("not a known engine", null, [
          { name: "bgcolor", value: "pink" },
          { name: "ratio", value: 1 },
        ])
      ).to.equal(
        'fontname="Helvetica" fontsize=12 penwidth=2.0 bgcolor=pink ratio=1'
      );
    });
  });

  describe("buildNodeAttributes", () => {
    it("returns the generic attributes nothing is passed", () => {
      expect(attributebuilder.buildNodeAttributes()).to.equal(
        'shape=plaintext style=filled fillcolor="#FFFFFF01" fontname=Helvetica fontsize=12 penwidth=2.0'
      );
    });
    it("appends attributes when these are passed", () => {
      expect(
        attributebuilder.buildNodeAttributes([
          {
            name: "foo",
            value: "bar",
          },
        ])
      ).to.equal(
        'shape=plaintext style=filled fillcolor="#FFFFFF01" fontname=Helvetica fontsize=12 penwidth=2.0 foo=bar'
      );
    });
  });

  describe("buildEdgeAttributes", () => {
    it("returns the generic attributes nothing is passed", () => {
      expect(attributebuilder.buildEdgeAttributes()).to.equal(
        "fontname=Helvetica fontsize=10"
      );
    });
    it("appends attributes when these are passed", () => {
      expect(
        attributebuilder.buildEdgeAttributes([
          {
            name: "baz",
            value: "qux",
          },
        ])
      ).to.equal("fontname=Helvetica fontsize=10 baz=qux");
    });
  });
});
