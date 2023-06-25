export default class Counter {
    COUNTER = 0;
    constructor() {
        this.reset();
    }
    reset() {
        this.COUNTER = 0;
    }
    next() {
        return ++this.COUNTER;
    }
    nextAsString() {
        const lBase = 10;
        return this.next().toString(lBase);
    }
}
