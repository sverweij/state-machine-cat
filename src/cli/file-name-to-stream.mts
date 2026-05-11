/* eslint-disable security/detect-non-literal-fs-filename */
import { createReadStream, createWriteStream } from "node:fs";
import { Readable, Writable } from "node:stream";

export function getOutStream(pOutputTo: string): Writable {
  if ("-" === pOutputTo) {
    return process.stdout;
  }
  return createWriteStream(pOutputTo);
}

export function getInStream(pInputFrom: string): Readable {
  if ("-" === pInputFrom) {
    return process.stdin;
  }
  return createReadStream(pInputFrom);
}
