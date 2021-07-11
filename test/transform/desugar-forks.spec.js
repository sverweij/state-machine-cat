import chai from "chai";
import desugar from "../../src/transform/desugar.js";
import utl from "./utl.js";

const expect = chai.expect;

describe("transform/desugar - forks", () => {
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
});
