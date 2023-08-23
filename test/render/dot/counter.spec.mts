import { equal } from "node:assert/strict";
import Counter from "../../../src/render/dot/counter.mjs";

describe("counter ", () => {
  it("starts as 0", () => {
    const lCounter = new Counter();

    equal(lCounter.next(), 1);
  });

  it("next calls increase", () => {
    const lCounter = new Counter();

    equal(lCounter.next(), 1);
    // expect\(lCounter.next\(\)\)\.to\.equal\(([^)]+)\);
    equal(lCounter.next(), 2);
    equal(lCounter.next(), 3);
  });

  it("resets to 0", () => {
    const lCounter = new Counter();

    equal(lCounter.next(), 1);
    equal(lCounter.next(), 2);
    equal(lCounter.next(), 3);
    lCounter.reset();
    equal(lCounter.next(), 1);
  });

  it("nextAsString calls increase and returns the result stringified in base10", () => {
    const lCounter = new Counter();

    equal(lCounter.nextAsString(), "1");
    equal(lCounter.nextAsString(), "2");
    equal(lCounter.nextAsString(), "3");
  });
});
