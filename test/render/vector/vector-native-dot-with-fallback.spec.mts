import { equal, throws } from "node:assert/strict";
import dotToSVG from "#render/vector/vector-native-dot-with-fallback.mjs";

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

    equal(lOutput.includes("<svg"), true);
    equal(lOutput.includes("</svg>"), true);
  });

  it("returns an SVG when the 'dot' program doesn't exist", () => {
    const lOutput = dotToSVG(AST, {
      exec: "this_executable_does_not_exist_for_sure",
      noDotNativeWarning: true,
    });

    equal(lOutput.includes("<svg"), true);
    equal(lOutput.includes("</svg>"), true);
  });

  it("throws when the 'dot' program doesn't exists and format not supported by the wasm fall back is requested", () => {
    throws(() => {
      dotToSVG(AST, {
        exec: "this_executable_does_not_exist_for_sure",
        outputType: "png",
      });
    });
  });
});
