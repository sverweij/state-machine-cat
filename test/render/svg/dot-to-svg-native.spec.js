const chai = require("chai");
const dotToSVG = require("../../../src/render/svg/dot-to-svg-native");

const expect = chai.expect;

if (dotToSVG.isAvailable()) {
  describe("dot-to-svg-native - isAvailable", () => {
    it("returns false when the executable isn't available", () => {
      expect(
        dotToSVG.isAvailable({
          exec: "this_executable_does_not_exist_in_the_path",
        })
      ).to.equal(false);
    });
    it("returns true when the executable is available", () => {
      expect(
        dotToSVG.isAvailable({
          exec: "dot",
        })
      ).to.equal(true);
    });
  });

  describe("dot-to-svg-native - convert", () => {
    it("renders an svg when presented with valid dot", () => {
      expect(dotToSVG.convert("digraph { a }")).to.contain("<svg");
      expect(dotToSVG.convert("digraph { a }")).to.contain("</svg>");
    });

    it("throws an error when presented with an invalid dot", () => {
      expect(() => {
        dotToSVG.convert("this ain't no dot program");
      }).to.throw("Unexpected error occurred. Exit code 1");
    });
    it("throws an error when it can't find the executable", () => {
      expect(() => {
        dotToSVG.convert("digraph { a }", {
          exec: "this_executable_does_not_exist_in_the_path",
        });
      }).to.throw(
        "Error: spawnSync this_executable_does_not_exist_in_the_path ENOENT"
      );
    });
  });
}
