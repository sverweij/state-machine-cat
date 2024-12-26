export class Counter {
	#lHWM = 0;
	constructor(pStart = 0) {
		this.#lHWM = pStart;
	}
	next() {
		return ++this.#lHWM;
	}
}
