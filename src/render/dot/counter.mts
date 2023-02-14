export default class Counter {
  COUNTER = 0;
  constructor() {
    this.reset();
  }

  /**
   * @returns {void}
   */
  reset() {
    this.COUNTER = 0;
  }

  /**
   * @returns {number}
   */
  next() {
    // eslint-disable-next-line no-plusplus
    return ++this.COUNTER;
  }

  /**
   * @returns {string}
   */
  nextAsString() {
    /** @type {number} */
    const lBase = 10;

    return this.next().toString(lBase);
  }
}
