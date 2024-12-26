export class Counter {
  #lHWM = 0;

  constructor(pStart: number = 0) {
    this.#lHWM = pStart;
  }

  next(): number {
    // eslint-disable-next-line no-plusplus
    return ++this.#lHWM;
  }
}
