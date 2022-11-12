// @ts-check
/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";

/**
 * @param {string} pOutputTo
 * @returns {NodeJS.WritableStream}
 */
export function getOutStream(pOutputTo) {
  if ("-" === pOutputTo) {
    return process.stdout;
  }
  return fs.createWriteStream(pOutputTo);
}

/**
 * @param {string} pInputFrom
 * @returns {NodeJS.ReadableStream}
 */
export function getInStream(pInputFrom) {
  if ("-" === pInputFrom) {
    return process.stdin;
  }
  return fs.createReadStream(pInputFrom);
}
