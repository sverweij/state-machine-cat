import { strictEqual, throws } from "node:assert";
import isPng from "is-png";
import isPdf from "is-pdf";
import dotToVector from "../../../src/render/vector/dot-to-vector-native.mjs";

if (dotToVector.isAvailable()) {
  describe("dot-to-svg-native - isAvailable", () => {
    it("returns false when the executable isn't available", () => {
      strictEqual(
        dotToVector.isAvailable({
          exec: "this_executable_does_not_exist_in_the_path",
        }),
        false,
      );
    });
    it("returns true when the executable is available", () => {
      strictEqual(
        dotToVector.isAvailable({
          exec: "dot",
        }),
        true,
      );
    });
  });

  describe("dot-to-vector-native - convert [a]", () => {
    it("renders an svg when presented with valid dot when no extra options passed", () => {
      const lFound = dotToVector.convert("digraph { a }");

      strictEqual(lFound.includes("<svg"), true);
      // expect\(([^\)]+)\)\.to\.contain\(([^\)]+)\);
      strictEqual(lFound.includes("</svg>"), true);
    });

    it("renders an svg when presented with valid dot when svg is passed as an explicit option", () => {
      const lFound = dotToVector.convert("digraph { a }", { format: "svg" });

      strictEqual(lFound.includes("<svg"), true);
      strictEqual(lFound.includes("</svg>"), true);
    });

    it("renders postscript when presented with valid dot when ps is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", { format: "ps" });

      strictEqual(lFound.includes("%!PS-Adobe-3.0"), true);
      strictEqual(lFound.includes("%%EOF"), true);
    });

    it("renders postscript when presented with valid dot when ps2 is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", { format: "ps2" });

      strictEqual(lFound.includes("%!PS-Adobe-3.0"), true);
      strictEqual(lFound.includes("%%EOF"), true);
    });

    it("renders encapsulated postscript when presented with valid dot when eps is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", { format: "eps" });

      strictEqual(lFound.includes("%!PS-Adobe-3.0 EPSF-3.0"), true);
      strictEqual(lFound.includes("%%EOF"), true);
    });

    it("renders png when presented with valid dot when png is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", {
        format: "png",
      });
      const lFoundAsBuffer = Buffer.from(lFound, "binary");

      strictEqual(isPng(lFoundAsBuffer), true);
    });

    it("renders pdf when presented with valid dot when pdf is passed as an option", () => {
      const lFound = dotToVector.convert("digraph { a }", {
        format: "pdf",
      });
      const lFoundAsBuffer = Buffer.from(lFound, "binary");

      strictEqual(isPdf(lFoundAsBuffer), true);
    });

    it("throws an error when presented with an invalid dot", () => {
      throws(() => {
        dotToVector.convert("this ain't no dot program");
      }, /Unexpected error occurred\. Exit code 1/);
    });
    it("throws an error when it can't find the executable", () => {
      throws(() => {
        dotToVector.convert("digraph { a }", {
          exec: "this_executable_does_not_exist_in_the_path",
        });
      }, /Error: spawnSync this_executable_does_not_exist_in_the_path ENOENT/);
    });
  });
}
