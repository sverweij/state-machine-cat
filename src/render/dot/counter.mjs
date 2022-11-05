// @ts-check
export default class Counter {
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
    // @ts-expect-error TS thinks COUNTER can possibly be null as it doesn't
    // see that the function the constructor calls ensures it won't
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
