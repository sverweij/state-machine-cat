const chai = require("chai");
const dotToSVG = require("../../../src/render/svg/svg-native-dot-with-fallback");

const expect = chai.expect;

const AST = {
  transitions: [
    {
      from: "a",
      to: "b",
    },
  ],
  states: [
    {
      name: "a",
      type: "regular",
    },
    {
      name: "b",
      type: "regular",
    },
  ],
};

describe("svg-native-dot-with-fallback", () => {
  it("returns an SVG when the 'dot' program exists and is in the path", () => {
    const lOutput = dotToSVG(AST);

    expect(lOutput).to.contain("<svg");
    expect(lOutput).to.contain("</svg>");
  });

  it("returns an SVG when the 'dot' program doesn't exists and is in the path", () => {
    const lOutput = dotToSVG(AST, {
      exec: "this_executable_does_not_exist_for_sure",
    });

    expect(lOutput).to.contain("<svg");
    expect(lOutput).to.contain("</svg>");
  });
});
