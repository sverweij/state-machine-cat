import { expect } from "chai";
import isPng from "is-png";
import isPdf from "is-pdf";
import dotToVector from "../../../src/render/vector/dot-to-vector-native.mjs";

if (dotToVector.isAvailable()) {
  describe("dot-to-svg-native - isAvailable", () => {
    it("returns false when the executable isn't available", () => {
      expect(
        dotToVector.isAvailable({
          exec: "this_executable_does_not_exist_in_the_path",
        })
      ).to.equal(false);
    });
    it("returns true when the executable is available", () => {
      expect(
        dotToVector.isAvailable({
          exec: "dot",
        })
      ).to.equal(true);
    });
  });

  describe("dot-to-vector-native - convert", () => {
    it("renders an svg when presented with valid dot when no extra options passed", () => {
      const lFound = dotToVector.convert("digraph { a }");

      expect(lFound).to.contain("<svg");
      expect(lFound).to.contain("</svg>");
    });

    it("renders an svg when presented with valid dot when svg is passed as an explicit option", () => {
      const lFound = dotToVector.convert("digraph { a }", { format: "svg" });

      expect(lFound).to.contain("<svg");
      expect(lFound).to.contain("</svg>");
    });

    it("renders postscript when presented with valid dot when ps is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", { format: "ps" });

      expect(lFound).to.contain("%!PS-Adobe-3.0");
      expect(lFound).to.contain("%%EOF");
    });

    it("renders postscript when presented with valid dot when ps2 is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", { format: "ps2" });

      expect(lFound).to.contain("%!PS-Adobe-3.0");
      expect(lFound).to.contain("%%EOF");
    });

    it("renders encapsulated postscript when presented with valid dot when eps is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", { format: "eps" });

      expect(lFound).to.contain("%!PS-Adobe-3.0 EPSF-3.0");
      expect(lFound).to.contain("%%EOF");
    });

    it("renders png when presented with valid dot when png is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", {
        format: "png",
      });
      const lFoundAsBuffer = Buffer.from(lFound, "binary");

      expect(isPng(lFoundAsBuffer)).to.equal(true);
    });

    it("renders pdf when presented with valid dot when pdf is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", {
        format: "pdf",
      });
      const lFoundAsBuffer = Buffer.from(lFound, "binary");

      expect(isPdf(lFoundAsBuffer)).to.equal(true);
    });

    it("throws an error when presented with an invalid dot", () => {
      expect(() => {
        dotToVector.convert("this ain't no dot program");
      }).to.throw("Unexpected error occurred. Exit code 1");
    });
    it("throws an error when it can't find the executable", () => {
      expect(() => {
        dotToVector.convert("digraph { a }", {
          exec: "this_executable_does_not_exist_in_the_path",
        });
      }).to.throw(
        "Error: spawnSync this_executable_does_not_exist_in_the_path ENOENT"
      );
    });
  });
}
