import { deepStrictEqual } from "node:assert";
import stateTransformers from "../../../src/render/dot/state-transformers.mjs";

describe("render/dot/state-transformers - classifyState [a] ", () => {
  it("by default, states get 'state' and their type as a class attribute", () => {
    deepStrictEqual(stateTransformers.classifyState({ type: "regular" }), {
      type: "regular",
      class: "state regular",
    });
  });
  it("when  default, states get 'state' and their type as a class attribute", () => {
    deepStrictEqual(
      stateTransformers.classifyState({
        type: "junction",
        class: "petty coat",
      }),
      {
        type: "junction",
        class: "state junction petty coat",
      },
    );
  });

  it("class fields get trimmed and cleaned of superfluous spaces", () => {
    deepStrictEqual(
      stateTransformers.classifyState({
        type: "regular",
        class: "   lotsa  space     before between   and after     ",
      }),
      {
        type: "regular",
        class: "state regular lotsa space before between and after",
      },
    );
  });
});
