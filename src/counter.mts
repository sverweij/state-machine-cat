export class Counter {
  #lHWM = 0;

  public constructor(pStart: number = 0) {
    this.#lHWM = pStart;
  }

  public next(): number {
    // oxlint-disable-next-line no-plusplus
    return ++this.#lHWM;
  }
}
