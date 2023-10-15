import { deepEqual } from "node:assert/strict";
import utl from "./utl.mjs";
import desugar from "#transform/desugar.mjs";

describe("transform/desugar - forks", () => {
  it("leaves empty state machines alone", () => {
    const lEmptyMachine = { states: [] };

    deepEqual(desugar(lEmptyMachine), lEmptyMachine);
  });

  it("leaves state machines without forks alone", () => {
    const FORKLESS = utl.readFixture("noforknojoin.json");

    deepEqual(desugar(FORKLESS), FORKLESS);
  });

  it("if there's > 1 pseudo state, don't duplicate transitions", () => {
    const WITHFORK = utl.readFixture("2pseudostates.json");
    const WITHOUTFORK = utl.readFixture("2pseudostates.desugared.json");

    deepEqual(desugar(WITHFORK), WITHOUTFORK);
  });
});
