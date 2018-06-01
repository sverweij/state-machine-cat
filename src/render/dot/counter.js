class Counter {
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
        return this.next().toString(10);
    }
}

module.exports = Counter;
