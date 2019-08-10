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

  it("replaces forks with the transitions they represent", () => {
    const WITHFORK = utl.readFixture("singlefork.json");
    const WITHOUTFORK = utl.readFixture("singlefork.desugared.json");
    expect(desugar(WITHFORK)).to.deep.equal(WITHOUTFORK);
  });

  it("replaces forks in nested sms' with the transitions they represent", () => {
    const WITHFORK = utl.readFixture("singlenestedfork.json");
    const WITHOUTFORK = utl.readFixture("singlenestedfork.desugared.json");
    expect(desugar(WITHFORK)).to.deep.equal(WITHOUTFORK);
  });

  it("replaces forks to sm's with the transitions they represent", () => {
    const WITHFORK = utl.readFixture("forkintonested.json");
    const WITHOUTFORK = utl.readFixture("forkintonested.desugared.json");
    expect(desugar(WITHFORK)).to.deep.equal(WITHOUTFORK);
  });

  it("replaces forks to higher up levels with the transitions they represent", () => {
    const WITHFORK = utl.readFixture("forkfromnestedtohigherup.json");
    const WITHOUTFORK = utl.readFixture(
      "forkfromnestedtohigherup.desugared.json"
    );
    expect(desugar(WITHFORK)).to.deep.equal(WITHOUTFORK);
  });

  it("merges incoming and outgoing actions", () => {
    const WITHFORK = utl.readFixture("forkmergeactions.json");
    const WITHOUTFORK = utl.readFixture("forkmergeactions.desugared.json");
    expect(desugar(WITHFORK)).to.deep.equal(WITHOUTFORK);
  });

  it("uses the outgoing action if there's no incoming one", () => {
    const WITHFORK = utl.readFixture("forkuseoutgoingaction.json");
    const WITHOUTFORK = utl.readFixture("forkuseoutgoingaction.desugared.json");
    expect(desugar(WITHFORK)).to.deep.equal(WITHOUTFORK);
  });

  it("if there's > 1 pseudo state, don't duplicate no transitions", () => {
    const WITHFORK = utl.readFixture("2pseudostates.json");
    const WITHOUTFORK = utl.readFixture("2pseudostates.desugared.json");
    expect(desugar(WITHFORK)).to.deep.equal(WITHOUTFORK);
  });
});
