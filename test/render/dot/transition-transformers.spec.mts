import { deepStrictEqual } from "node:assert";
import transitionTransformers from "../../../src/render/dot/transition-transformers.mjs";

describe("render/dot/transition-transformers - classifyState [a]", () => {
  it("by default, transitions get 'transition' as a class attribute", () => {
    deepStrictEqual(transitionTransformers.classifyTransition({}), {
      class: "transition",
    });
  });
  it("transitions get 'transition' and their type as a class attribute when they have an explicit type", () => {
    deepStrictEqual(
      transitionTransformers.classifyTransition({ type: "external" }),
      {
        type: "external",
        class: "transition external",
      },
    );
  });
  it("transitions with a class attribute get the default class attributes for a transition + that class", () => {
    deepStrictEqual(
      transitionTransformers.classifyTransition({
        class: "petty coat",
      }),
      {
        class: "transition petty coat",
      },
    );
  });

  it("transitions with a class attribute & an explicit type get the default class attributes for a transition + that class", () => {
    deepStrictEqual(
      transitionTransformers.classifyTransition({
        type: "internal",
        class: "petty coat",
      }),
      {
        type: "internal",
        class: "transition internal petty coat",
      },
    );
  });
  it("class fields get trimmed and cleaned of superfluous spaces", () => {
    deepStrictEqual(
      transitionTransformers.classifyTransition({
        class: "   lotsa  space     before between   and after     ",
      }),
      {
        class: "transition lotsa space before between and after",
      },
    );
  });
});
