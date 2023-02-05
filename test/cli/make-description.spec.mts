import { expect } from "chai";
import makeDescription from "../../src/cli/make-description.mjs";

describe("#cli - makeDescription", () => {
  it("tells about the asm.js when graphviz dot can't be found", () => {
    expect(makeDescription(false)).to.contain(
      "When you want to output svg and the native GraphViz isn't installed"
    );
  });

  it("doesn't tell about the asm.js when an AOK version of dot can be executed", () => {
    expect(makeDescription(true)).to.not.contain(
      "When you want to output svg and the native GraphViz isn't installed"
    );
  });
});
/* eslint no-undefined: 0 */
