import { fileURLToPath } from "node:url";
import { ReadStream, WriteStream, unlinkSync } from "node:fs";
import { Readable, Writable } from "node:stream";
import { expect } from "chai";
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
    new URL("output/tmp_hello_filename_to_stream.json", import.meta.url)
  );

  after("tear down", () => {
    removeDammit(OUTFILE);
  });

  it("getOutStream('-') is a writable stream", () => {
    expect(getOutStream("-") instanceof Writable).to.be.true;
  });
  it("getOutStream('-') yields stdout", () => {
    expect(getOutStream("-")).to.equal(process.stdout);
  });
  it("getOutStream('-') yields does not yield a file stream", () => {
    expect(getOutStream("-") instanceof WriteStream).to.be.false;
  });
  it("getOutStream(OUTFILE) yields a writable", () => {
    expect(getOutStream(OUTFILE) instanceof Writable).to.be.true;
  });
  it("getOutStream(OUTFILE) yields a writable stream", () => {
    expect(getOutStream(OUTFILE) instanceof WriteStream).to.be.true;
  });
  it("getOutStream(OUTFILE) does not yield stdout", () => {
    expect(getOutStream(OUTFILE)).to.not.equal(process.stdout);
  });

  it("getInStream('-') is a readable stream", () => {
    expect(getInStream("-") instanceof Readable).to.be.true;
  });
  it("getInStream('-') yields stdin", () => {
    expect(getInStream("-")).to.equal(process.stdin);
  });
  it("getInStream('-') does not yield a file stream", () => {
    expect(getInStream("-") instanceof ReadStream).to.be.false;
  });
  it("getInStream(OUTFILE) yields a writable stream", () => {
    expect(getInStream(OUTFILE) instanceof Readable).to.be.true;
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    expect(getInStream(OUTFILE) instanceof ReadStream).to.be.true;
  });
  it("getInStream(OUTFILE) does not yields stdin", () => {
    expect(getInStream(OUTFILE)).to.not.equal(process.stdin);
  });
});

/* eslint no-unused-expressions:0 */
