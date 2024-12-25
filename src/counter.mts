export class Counter {
  _lHWM = 0;

  constructor(pStart: number = 0) {
    this._lHWM = pStart;
  }

  next(): number {
    // eslint-disable-next-line no-plusplus
    return ++this._lHWM;
  }
}
