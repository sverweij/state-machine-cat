import { expect } from "chai";
import dotToSVG from "../../../src/render/vector/vector-native-dot-with-fallback.mjs";

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

  it("returns an SVG when the 'dot' program doesn't exist", () => {
    const lOutput = dotToSVG(AST, {
      exec: "this_executable_does_not_exist_for_sure",
      noDotNativeWarning: true,
    });

    expect(lOutput).to.contain("<svg");
    expect(lOutput).to.contain("</svg>");
  });

  it("throws when the 'dot' program doesn't exists and an viz.js unsupported format is requested", () => {
    expect(() => {
      dotToSVG(AST, {
        exec: "this_executable_does_not_exist_for_sure",
        outputType: "png",
      });
    }).to.throw();
  });
});
