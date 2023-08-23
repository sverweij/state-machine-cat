import { equal } from "node:assert/strict";
import utl from "../../../src/render/dot/utl.mjs";
import StateMachineModel from "../../../src/state-machine-model.mjs";

const AST = {
  states: [
    {
      name: "a",
      type: "regular",
      statemachine: {
        transitions: [
          {
            from: "a.a",
            to: "a.a",
          },
          {
            from: "a.a",
            to: "a.b",
          },
        ],
        states: [
          {
            name: "a.a",
            type: "regular",
          },
          {
            name: "a.b",
            type: "regular",
          },
        ],
      },
    },
    {
      name: "b",
      type: "regular",
    },
  ],
  transitions: [
    {
      from: "a",
      to: "b",
    },
  ],
};

describe("utl.isCompositeSelf ", () => {
  const lModel = new StateMachineModel(AST);

  it("returns false when from !== to and neither is composite", () => {
    equal(utl.isCompositeSelf(lModel, { from: "a.a", to: "a.b" }), false);
  });

  it("returns false when from !== to and both are composite", () => {
    equal(utl.isCompositeSelf(lModel, { from: "a", to: "b" }), false);
  });

  it("returns false when from === to and it's not composite", () => {
    equal(utl.isCompositeSelf(lModel, { from: "a.a", to: "a.a" }), false);
  });

  it("returns false when from === to and it's composite but internal", () => {
    equal(
      utl.isCompositeSelf(lModel, { from: "a", to: "a", type: "internal" }),
      false,
    );
  });

  it("returns true when from === to and it's composite", () => {
    equal(utl.isCompositeSelf(lModel, { from: "a", to: "a" }), true);
  });

  it("returns true when from === to and it's composite (explicitly set)", () => {
    equal(
      utl.isCompositeSelf(lModel, { from: "a", to: "a", type: "external" }),
      true,
    );
  });
});
