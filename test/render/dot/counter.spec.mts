import { strictEqual } from "node:assert";
import Counter from "../../../src/render/dot/counter.mjs";

describe("counter ", () => {
  it("starts as 0", () => {
    const lCounter = new Counter();

    strictEqual(lCounter.next(), 1);
  });

  it("next calls increase", () => {
    const lCounter = new Counter();

    strictEqual(lCounter.next(), 1);
    // expect\(lCounter.next\(\)\)\.to\.equal\(([^)]+)\);
    strictEqual(lCounter.next(), 2);
    strictEqual(lCounter.next(), 3);
  });

  it("resets to 0", () => {
    const lCounter = new Counter();

    strictEqual(lCounter.next(), 1);
    strictEqual(lCounter.next(), 2);
    strictEqual(lCounter.next(), 3);
    lCounter.reset();
    strictEqual(lCounter.next(), 1);
  });

  it("nextAsString calls increase and returns the result stringified in base10", () => {
    const lCounter = new Counter();

    strictEqual(lCounter.nextAsString(), "1");
    strictEqual(lCounter.nextAsString(), "2");
    strictEqual(lCounter.nextAsString(), "3");
  });
});
