/* eslint-disable security/detect-non-literal-fs-filename */

import * as fs from "node:fs";

/**
 *
 * @param {string} pOutputTo
 * @returns {import("node:fs").WriteStream}
 */
export function getOutStream(pOutputTo) {
  if ("-" === pOutputTo) {
    return process.stdout;
  }
  return fs.createWriteStream(pOutputTo);
}
/**
 *
 * @param {string} pInputFrom
 * @returns {import("node:fs").ReadStream}
 */
export function getInStream(pInputFrom) {
  if ("-" === pInputFrom) {
    return process.stdin;
  }
  return fs.createReadStream(pInputFrom);
}
