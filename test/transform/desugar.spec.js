const chai = require("chai");
const desugar = require("../../src/transform/desugar");
const utl = require("./utl");

const expect = chai.expect;

describe("transform/desugar - forks", () => {
  it("leaves empty state machines alone", () => {
    const EMPTY_MACHINE = { states: [] };

    expect(desugar(EMPTY_MACHINE)).to.deep.equal(EMPTY_MACHINE);
  });

  it("leaves state machines without forks alone", () => {
    const FORKLESS = utl.readFixture("noforknojoin.json");

    expect(desugar(FORKLESS)).to.deep.equal(FORKLESS);
  });

  it("if there's > 1 pseudo state, don't duplicate transitions", () => {
    const WITHFORK = utl.readFixture("2pseudostates.json");
    const WITHOUTFORK = utl.readFixture("2pseudostates.desugared.json");

    expect(desugar(WITHFORK)).to.deep.equal(WITHOUTFORK);
  });
});
