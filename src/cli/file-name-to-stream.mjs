/* eslint-disable security/detect-non-literal-fs-filename */

import * as fs from "node:fs";

export function getOutStream(pOutputTo) {
  if ("-" === pOutputTo) {
    return process.stdout;
  }
  return fs.createWriteStream(pOutputTo);
}
export function getInStream(pInputFrom) {
  if ("-" === pInputFrom) {
    return process.stdin;
  }
  return fs.createReadStream(pInputFrom);
}
