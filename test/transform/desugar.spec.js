import { expect } from "chai";
import desugar from "../../src/transform/desugar.js";
import utl from "./utl.js";

describe("transform/desugar - forks", () => {
  it("leaves empty state machines alone", () => {
    const lEmptyMachine = { states: [] };

    expect(desugar(lEmptyMachine)).to.deep.equal(lEmptyMachine);
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
