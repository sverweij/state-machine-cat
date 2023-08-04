import { deepStrictEqual } from "node:assert";
import desugar from "../../src/transform/desugar.mjs";
import utl from "./utl.mjs";

describe("transform/desugar - junctions [a]", () => {
  it("leaves empty state machines alone", () => {
    const lEmptyMachine = { states: [] };

    deepStrictEqual(desugar(lEmptyMachine), lEmptyMachine);
  });

  it("leaves state machines without pseudo states alone", () => {
    const JUNCTIONLESS = utl.readFixture("noforknojoin.json");

    deepStrictEqual(desugar(JUNCTIONLESS), JUNCTIONLESS);
  });

  it("replaces a single junctions with the transitions they represent", () => {
    const WITHJUNCTION = utl.readFixture("junction.json");
    const WITHOUTJUNCTION = utl.readFixture("junction.desugared.json");

    deepStrictEqual(desugar(WITHJUNCTION), WITHOUTJUNCTION);
  });

  it("replaces a multiple junctions with the transitions they represent", () => {
    const WITHJUNCTION = utl.readFixture("junctions.json");
    const WITHOUTJUNCTION = utl.readFixture("junctions.desugared.json");

    deepStrictEqual(desugar(WITHJUNCTION), WITHOUTJUNCTION);
  });
});
