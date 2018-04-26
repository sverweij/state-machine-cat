const fs = require("fs");

module.exports = {
    getOutStream(pOutputTo) {
        if ("-" === pOutputTo) {
            return process.stdout;
        }
        return fs.createWriteStream(pOutputTo);
    },
    getInStream(pInputFrom) {
        if ("-" === pInputFrom) {
            return process.stdin;
        }
        return fs.createReadStream(pInputFrom);
    }
};
