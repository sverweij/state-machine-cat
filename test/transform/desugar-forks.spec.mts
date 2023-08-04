import { deepStrictEqual } from "node:assert";
import desugar from "../../src/transform/desugar.mjs";
import utl from "./utl.mjs";

describe("transform/desugar - forks [a]", () => {
  it("replaces forks with the transitions they represent", () => {
    const WITHFORK = utl.readFixture("singlefork.json");
    const WITHOUTFORK = utl.readFixture("singlefork.desugared.json");

    deepStrictEqual(desugar(WITHFORK), WITHOUTFORK);
  });

  it("replaces forks in nested sms' with the transitions they represent", () => {
    const WITHFORK = utl.readFixture("singlenestedfork.json");
    const WITHOUTFORK = utl.readFixture("singlenestedfork.desugared.json");

    deepStrictEqual(desugar(WITHFORK), WITHOUTFORK);
  });

  it("replaces forks to sm's with the transitions they represent", () => {
    const WITHFORK = utl.readFixture("forkintonested.json");
    const WITHOUTFORK = utl.readFixture("forkintonested.desugared.json");

    deepStrictEqual(desugar(WITHFORK), WITHOUTFORK);
  });

  it("replaces forks to higher up levels with the transitions they represent", () => {
    const WITHFORK = utl.readFixture("forkfromnestedtohigherup.json");
    const WITHOUTFORK = utl.readFixture(
      "forkfromnestedtohigherup.desugared.json",
    );

    deepStrictEqual(desugar(WITHFORK), WITHOUTFORK);
  });

  it("merges incoming and outgoing actions", () => {
    const WITHFORK = utl.readFixture("forkmergeactions.json");
    const WITHOUTFORK = utl.readFixture("forkmergeactions.desugared.json");

    deepStrictEqual(desugar(WITHFORK), WITHOUTFORK);
  });

  it("uses the outgoing action if there's no incoming one", () => {
    const WITHFORK = utl.readFixture("forkuseoutgoingaction.json");
    const WITHOUTFORK = utl.readFixture("forkuseoutgoingaction.desugared.json");

    deepStrictEqual(desugar(WITHFORK), WITHOUTFORK);
  });
});
