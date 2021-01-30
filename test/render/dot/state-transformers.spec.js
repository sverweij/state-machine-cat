const expect = require("chai").expect;
const stateTransformers = require("../../../src/render/dot/state-transformers");

describe("render/dot/state-transformers - classifyState", () => {
  it("by default, states get 'state' and their type as a class attribute", () => {
    expect(stateTransformers.classifyState({ type: "regular" })).to.deep.equal({
      type: "regular",
      class: "state regular",
    });
  });
  it("when  default, states get 'state' and their type as a class attribute", () => {
    expect(
      stateTransformers.classifyState({ type: "junction", class: "petty coat" })
    ).to.deep.equal({
      type: "junction",
      class: "state junction petty coat",
    });
  });

  it("class fields get trimmed and cleaned of superfluous spaces", () => {
    expect(
      stateTransformers.classifyState({
        type: "regular",
        class: "   lotsa  space     before between   and after     ",
      })
    ).to.deep.equal({
      type: "regular",
      class: "state regular lotsa space before between and after",
    });
  });
});
