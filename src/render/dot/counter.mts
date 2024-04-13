export default class Counter {
  COUNTER = 0;
  constructor() {
    this.reset();
  }

  reset(): void {
    this.COUNTER = 0;
  }

  next(): number {
    // eslint-disable-next-line no-plusplus
    return ++this.COUNTER;
  }

  nextAsString(): string {
    const lBase: number = 10;

    return this.next().toString(lBase);
  }
}
