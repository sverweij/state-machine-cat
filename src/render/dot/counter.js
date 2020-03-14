class Counter {
  constructor() {
    this.reset();
  }

  reset() {
    this.COUNTER = 0;
  }

  next() {
    // eslint-disable-next-line no-plusplus
    return ++this.COUNTER;
  }

  nextAsString() {
    const BASE = 10;

    return this.next().toString(BASE);
  }
}

module.exports = Counter;
