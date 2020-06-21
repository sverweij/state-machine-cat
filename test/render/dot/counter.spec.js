const expect = require("chai").expect;
const Counter = require("~/src/render/dot/counter");

describe("counter", () => {
  it("starts as 0", () => {
    const lCounter = new Counter();

    expect(lCounter.next()).to.equal(1);
  });

  it("next calls increase", () => {
    const lCounter = new Counter();

    expect(lCounter.next()).to.equal(1);
    expect(lCounter.next()).to.equal(2);
    expect(lCounter.next()).to.equal(3);
  });

  it("resets to 0", () => {
    const lCounter = new Counter();

    expect(lCounter.next()).to.equal(1);
    expect(lCounter.next()).to.equal(2);
    expect(lCounter.next()).to.equal(3);
    lCounter.reset();
    expect(lCounter.next()).to.equal(1);
  });

  it("nextAsString calls increase and returns the result stringified in base10", () => {
    const lCounter = new Counter();

    expect(lCounter.nextAsString()).to.equal("1");
    expect(lCounter.nextAsString()).to.equal("2");
    expect(lCounter.nextAsString()).to.equal("3");
  });
});
