const expect = require("chai").expect;
const utl = require("../../../src/render/dot/utl");
const StateMachineModel = require("../../../src/state-machine-model");

const AST = {
  states: [
    {
      name: "a",
      type: "regular",
      statemachine: {
        transitions: [
          {
            from: "a.a",
            to: "a.a"
          },
          {
            from: "a.a",
            to: "a.b"
          }
        ],
        states: [
          {
            name: "a.a",
            type: "regular"
          },
          {
            name: "a.b",
            type: "regular"
          }
        ]
      }
    },
    {
      name: "b",
      type: "regular"
    }
  ],
  transitions: [
    {
      from: "a",
      to: "b"
    }
  ]
};

describe("utl.isCompositeSelf", () => {
  const lModel = new StateMachineModel(AST);
  it("returns false when from !== to and neither is composite", () => {
    expect(utl.isCompositeSelf(lModel, { from: "a.a", to: "a.b" })).to.equal(
      false
    );
  });

  it("returns false when from !== to and both are composite", () => {
    expect(utl.isCompositeSelf(lModel, { from: "a", to: "b" })).to.equal(false);
  });

  it("returns false when from === to and it's not composite", () => {
    expect(utl.isCompositeSelf(lModel, { from: "a.a", to: "a.a" })).to.equal(
      false
    );
  });

  it("returns false when from === to and it's composite but internal", () => {
    expect(
      utl.isCompositeSelf(lModel, { from: "a", to: "a", type: "internal" })
    ).to.equal(false);
  });

  it("returns true when from === to and it's composite", () => {
    expect(utl.isCompositeSelf(lModel, { from: "a", to: "a" })).to.equal(true);
  });

  it("returns true when from === to and it's composite (explicitly set)", () => {
    expect(
      utl.isCompositeSelf(lModel, { from: "a", to: "a", type: "external" })
    ).to.equal(true);
  });
});
