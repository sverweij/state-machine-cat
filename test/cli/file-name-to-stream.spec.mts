import { fileURLToPath } from "node:url";
import { ReadStream, WriteStream, unlinkSync } from "node:fs";
import { Readable, Writable } from "node:stream";
import { notStrictEqual, equal } from "node:assert/strict";
import {
  getInStream,
  getOutStream,
} from "../../src/cli/file-name-to-stream.mjs";

const removeDammit = (pFileName) => {
  try {
    unlinkSync(pFileName);
  } catch (pError) {
    // probably files didn't exist in the first place
    // so ignore the exception
  } finally {
    // also ignore what's happening on here
  }
};

describe("fileNameToStream", () => {
  const OUTFILE = fileURLToPath(
    new URL("output/tmp_hello_filename_to_stream.json", import.meta.url),
  );

  after("tear down", () => {
    removeDammit(OUTFILE);
  });

  it("getOutStream('-') is a writable stream", () => {
    equal(getOutStream("-") instanceof Writable, true);
  });
  it("getOutStream('-') yields stdout", () => {
    equal(getOutStream("-"), process.stdout);
  });
  it("getOutStream('-') yields does not yield a file stream", () => {
    equal(getOutStream("-") instanceof WriteStream, false);
  });
  it("getOutStream(OUTFILE) yields a writable", () => {
    equal(getOutStream(OUTFILE) instanceof Writable, true);
  });
  it("getOutStream(OUTFILE) yields a writable stream", () => {
    equal(getOutStream(OUTFILE) instanceof WriteStream, true);
  });
  it("getOutStream(OUTFILE) does not yield stdout", () => {
    notStrictEqual(getOutStream(OUTFILE), process.stdout);
  });

  it("getInStream('-') is a readable stream", () => {
    equal(getInStream("-") instanceof Readable, true);
  });
  it("getInStream('-') yields stdin", () => {
    equal(getInStream("-"), process.stdin);
  });
  it("getInStream('-') does not yield a file stream", () => {
    equal(getInStream("-") instanceof ReadStream, false);
  });
  it("getInStream(OUTFILE) yields a writable stream", () => {
    equal(getInStream(OUTFILE) instanceof Readable, true);
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    equal(getInStream(OUTFILE) instanceof ReadStream, true);
  });
  it("getInStream(OUTFILE) does not yields stdin", () => {
    notStrictEqual(getInStream(OUTFILE), process.stdin);
  });
});

/* eslint no-unused-expressions:0 */
