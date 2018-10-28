const fs               = require("fs");
const path             = require("path");
const stream           = require("stream");
const {expect}         = require("chai");
const {getOutStream, getInStream} = require("../../../src/cli/streamstuff/fileNameToStream");
const {resetOutputDir} = require("./utl");

const OUTFILE = path.join(__dirname, "..", "output", "tmp_hello.json");

describe("fileNameToStream", () => {

    before("set up", resetOutputDir);

    after("tear down", resetOutputDir);

    it("getOutStream('-') is a writable stream", () => {
        expect(getOutStream("-") instanceof stream.Writable).to.be.true;
    });
    it("getOutStream('-') yields stdout", () => {
        expect(getOutStream("-")).to.equal(process.stdout);
    });
    it("getOutStream('-') yields does not yield a file stream", () => {
        expect(getOutStream("-") instanceof fs.WriteStream).to.be.false;
    });
    it("getOutStream(OUTFILE) yields a writable stream", () => {
        expect(getOutStream(OUTFILE) instanceof stream.Writable).to.be.true;
    });
    it("getOutStream(OUTFILE) yields a writable file stream", () => {
        expect(getOutStream(OUTFILE) instanceof fs.WriteStream).to.be.true;

    });
    it("getOutStream(OUTFILE) does not yield stdout", () => {
        expect(getOutStream(OUTFILE)).to.not.equal(process.stdout);
    });

    it("getInStream('-') is a readable stream", () => {
        expect(getInStream("-") instanceof stream.Readable).to.be.true;
    });
    it("getInStream('-') yields stdin", () => {
        expect(getInStream("-")).to.equal(process.stdin);
    });
    it("getInStream('-') does not yield a file stream", () => {
        expect(getInStream("-") instanceof fs.ReadStream).to.be.false;
    });
    it("getInStream(OUTFILE) yields a writable stream", () => {
        expect(getInStream(OUTFILE) instanceof stream.Readable).to.be.true;
    });
    it("getInStream(OUTFILE) yields a readable file stream", () => {
        expect(getInStream(OUTFILE) instanceof fs.ReadStream).to.be.true;
    });
    it("getInStream(OUTFILE) does not yields stdin", () => {
        expect(getInStream(OUTFILE)).to.not.equal(process.stdin);
    });
});

/* eslint no-unused-expressions:0 */
