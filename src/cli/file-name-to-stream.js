/* eslint-disable security/detect-non-literal-fs-filename */

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
