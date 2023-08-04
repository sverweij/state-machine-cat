import { deepStrictEqual } from "node:assert";
import desugar from "../../src/transform/desugar.mjs";
import utl from "./utl.mjs";

describe("transform/desugar - forks [a]", () => {
  it("leaves empty state machines alone", () => {
    const lEmptyMachine = { states: [] };

    deepStrictEqual(desugar(lEmptyMachine), lEmptyMachine);
  });

  it("leaves state machines without forks alone", () => {
    const FORKLESS = utl.readFixture("noforknojoin.json");

    deepStrictEqual(desugar(FORKLESS), FORKLESS);
  });

  it("if there's > 1 pseudo state, don't duplicate transitions", () => {
    const WITHFORK = utl.readFixture("2pseudostates.json");
    const WITHOUTFORK = utl.readFixture("2pseudostates.desugared.json");

    deepStrictEqual(desugar(WITHFORK), WITHOUTFORK);
  });
});
