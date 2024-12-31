import { Writable } from "node:stream";
import { match } from "node:assert/strict";
import cli from "#cli/cli.mjs";

class WritableTestStream extends Writable {
  expected: RegExp | RegExp[] = /^$/;

  constructor(pExpected?: RegExp | RegExp[]) {
    super();
    if (pExpected) {
      this.expected = pExpected;
    }
  }
  write(pChunk) {
    if (Array.isArray(this.expected)) {
      this.expected.forEach((pExpectedRE) => {
        match(pChunk, pExpectedRE);
      });
    } else {
      match(pChunk, this.expected);
    }
    return true;
  }
}

describe("#cli - execute-command-line", () => {
  it("--license displays the license on stdout", async () => {
    const lOutStream = new WritableTestStream([
      /The MIT License \(MIT\)/,
      /Copyright \(c\) 2016-2025 Sander Verweij/,
    ]);
    const lErrorStream = new WritableTestStream();

    await cli(["node", "smcat.js", "--license"], {
      outStream: lOutStream,
      errorStream: lErrorStream,
    });
  });
});
