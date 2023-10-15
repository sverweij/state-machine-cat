import { deepEqual } from "node:assert/strict";
import utl from "./utl.mjs";
import desugar from "#transform/desugar.mjs";

describe("transform/desugar - junctions", () => {
  it("leaves empty state machines alone", () => {
    const lEmptyMachine = { states: [] };

    deepEqual(desugar(lEmptyMachine), lEmptyMachine);
  });

  it("leaves state machines without pseudo states alone", () => {
    const JUNCTIONLESS = utl.readFixture("noforknojoin.json");

    deepEqual(desugar(JUNCTIONLESS), JUNCTIONLESS);
  });

  it("replaces a single junctions with the transitions they represent", () => {
    const WITHJUNCTION = utl.readFixture("junction.json");
    const WITHOUTJUNCTION = utl.readFixture("junction.desugared.json");

    deepEqual(desugar(WITHJUNCTION), WITHOUTJUNCTION);
  });

  it("replaces a multiple junctions with the transitions they represent", () => {
    const WITHJUNCTION = utl.readFixture("junctions.json");
    const WITHOUTJUNCTION = utl.readFixture("junctions.desugared.json");

    deepEqual(desugar(WITHJUNCTION), WITHOUTJUNCTION);
  });
});
