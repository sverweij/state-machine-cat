const expect = require("chai").expect;
const makeDescription = require("../../src/cli/makeDescription");

describe("#cli - makeDescription", () => {
  it("tells about the asm.js warning on node >=12", () => {
    expect(makeDescription("v12.11.1")).to.contain(">=12");
  });

  it("doesn't tell about the asm.js warning on node <12", () => {
    expect(makeDescription("v10.16.3")).to.not.contain(">=12");
  });
});
/* eslint no-undefined: 0 */
