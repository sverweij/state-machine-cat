import { equal } from "node:assert/strict";
import * as utl from "#render/ndot/utl.mjs";
import StateMachineModel from "#state-machine-model.mjs";

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
    equal(
      utl.isCompositeSelf(lModel, { from: "a.a", to: "a.b", id: 1 }),
      false,
    );
  });

  it("returns false when from !== to and both are composite", () => {
    equal(utl.isCompositeSelf(lModel, { from: "a", to: "b", id: 1 }), false);
  });

  it("returns false when from === to and it's not composite", () => {
    equal(
      utl.isCompositeSelf(lModel, { from: "a.a", to: "a.a", id: 1 }),
      false,
    );
  });

  it("returns false when from === to and it's composite but internal", () => {
    equal(
      utl.isCompositeSelf(lModel, {
        from: "a",
        to: "a",
        type: "internal",
        id: 1,
      }),
      false,
    );
  });

  it("returns true when from === to and it's composite", () => {
    equal(utl.isCompositeSelf(lModel, { from: "a", to: "a", id: 1 }), true);
  });

  it("returns true when from === to and it's composite (explicitly set)", () => {
    equal(
      utl.isCompositeSelf(lModel, {
        from: "a",
        to: "a",
        type: "external",
        id: 1,
      }),
      true,
    );
  });
});
