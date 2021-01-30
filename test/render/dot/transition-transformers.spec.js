const expect = require("chai").expect;
const transitionTransformers = require("../../../src/render/dot/transition-transformers");

describe("render/dot/transition-transformers - classifyState", () => {
  it("by default, transitions get 'transition' as a class attribute", () => {
    expect(transitionTransformers.classifyTransition({})).to.deep.equal({
      class: "transition",
    });
  });
  it("transitions get 'transition' and their type as a class attribute when they have an explicit type", () => {
    expect(
      transitionTransformers.classifyTransition({ type: "external" })
    ).to.deep.equal({
      type: "external",
      class: "transition external",
    });
  });
  it("transitions with a class attribute get the default class attributes for a transition + that class", () => {
    expect(
      transitionTransformers.classifyTransition({
        class: "petty coat",
      })
    ).to.deep.equal({
      class: "transition petty coat",
    });
  });

  it("transitions with a class attribute & an explicit type get the default class attributes for a transition + that class", () => {
    expect(
      transitionTransformers.classifyTransition({
        type: "internal",
        class: "petty coat",
      })
    ).to.deep.equal({
      type: "internal",
      class: "transition internal petty coat",
    });
  });
  it("class fields get trimmed and cleaned of superfluous spaces", () => {
    expect(
      transitionTransformers.classifyTransition({
        class: "   lotsa  space     before between   and after     ",
      })
    ).to.deep.equal({
      class: "transition lotsa space before between and after",
    });
  });
});
