export class Counter {
	_lHWM = 0;
	constructor(pStart = 0) {
		this._lHWM = pStart;
	}
	next() {
		return ++this._lHWM;
	}
}
