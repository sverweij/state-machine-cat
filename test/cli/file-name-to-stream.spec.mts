import { fileURLToPath } from "node:url";
import { ReadStream, WriteStream, unlinkSync } from "node:fs";
import { Readable, Writable } from "node:stream";
import { notStrictEqual, strictEqual } from "node:assert";
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
    strictEqual(getOutStream("-") instanceof Writable, true);
  });
  it("getOutStream('-') yields stdout", () => {
    strictEqual(getOutStream("-"), process.stdout);
  });
  it("getOutStream('-') yields does not yield a file stream", () => {
    strictEqual(getOutStream("-") instanceof WriteStream, false);
  });
  it("getOutStream(OUTFILE) yields a writable", () => {
    strictEqual(getOutStream(OUTFILE) instanceof Writable, true);
  });
  it("getOutStream(OUTFILE) yields a writable stream", () => {
    strictEqual(getOutStream(OUTFILE) instanceof WriteStream, true);
  });
  it("getOutStream(OUTFILE) does not yield stdout", () => {
    notStrictEqual(getOutStream(OUTFILE), process.stdout);
  });

  it("getInStream('-') is a readable stream", () => {
    strictEqual(getInStream("-") instanceof Readable, true);
  });
  it("getInStream('-') yields stdin", () => {
    strictEqual(getInStream("-"), process.stdin);
  });
  it("getInStream('-') does not yield a file stream", () => {
    strictEqual(getInStream("-") instanceof ReadStream, false);
  });
  it("getInStream(OUTFILE) yields a writable stream", () => {
    strictEqual(getInStream(OUTFILE) instanceof Readable, true);
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    strictEqual(getInStream(OUTFILE) instanceof ReadStream, true);
  });
  it("getInStream(OUTFILE) does not yields stdin", () => {
    notStrictEqual(getInStream(OUTFILE), process.stdin);
  });
});

/* eslint no-unused-expressions:0 */
