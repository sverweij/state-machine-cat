/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "node:fs";

export function getOutStream(pOutputTo: string): NodeJS.WritableStream {
  if ("-" === pOutputTo) {
    return process.stdout;
  }
  return fs.createWriteStream(pOutputTo);
}

export function getInStream(pInputFrom: string): NodeJS.ReadableStream {
  if ("-" === pInputFrom) {
    return process.stdin;
  }
  return fs.createReadStream(pInputFrom);
}
