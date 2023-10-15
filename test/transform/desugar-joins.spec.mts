import { deepEqual } from "node:assert/strict";
import utl from "./utl.mjs";
import desugar from "#transform/desugar.mjs";

describe("transform/desugar - joins", () => {
  it("replaces joins with the transitions they represent", () => {
    const WITHJOIN = utl.readFixture("singlejoin.json");
    const WITHOUTJOIN = utl.readFixture("singlejoin.desugared.json");

    deepEqual(desugar(WITHJOIN, ["join"]), WITHOUTJOIN);
  });

  it("replaces joins in nested sms' with the transitions they represent", () => {
    const WITHJOIN = utl.readFixture("singlenestedjoin.json");
    const WITHOUTJOIN = utl.readFixture("singlenestedjoin.desugared.json");

    deepEqual(desugar(WITHJOIN, ["join"]), WITHOUTJOIN);
  });

  it("replaces joins to sm's with the transitions they represent", () => {
    const WITHJOIN = utl.readFixture("joinintonested.json");
    const WITHOUTJOIN = utl.readFixture("joinintonested.desugared.json");

    deepEqual(desugar(WITHJOIN, ["join"]), WITHOUTJOIN);
  });

  it("replaces joins to highr up sm's with the transitions they represent", () => {
    const WITHJOIN = utl.readFixture("joinfromnestedtohigherup.json");
    const WITHOUTJOIN = utl.readFixture(
      "joinfromnestedtohigherup.desugared.json",
    );

    deepEqual(desugar(WITHJOIN, ["join"]), WITHOUTJOIN);
  });

  it("merges incoming and outgoing actions", () => {
    const WITHJOIN = utl.readFixture("joinmergeactions.json");
    const WITHOUTJOIN = utl.readFixture("joinmergeactions.desugared.json");

    deepEqual(desugar(WITHJOIN, ["join"]), WITHOUTJOIN);
  });

  it("uses the outgoing action if there's no incoming one", () => {
    const WITHJOIN = utl.readFixture("joinuseoutgoingaction.json");
    const WITHOUTJOIN = utl.readFixture("joinuseoutgoingaction.desugared.json");

    deepEqual(desugar(WITHJOIN, ["join"]), WITHOUTJOIN);
  });
});
