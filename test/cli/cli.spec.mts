import { Writable } from "node:stream";
import { match } from "node:assert/strict";
import cli from "#cli/cli.mjs";

class WritableTestStream extends Writable {
  private expected: RegExp | RegExp[] = /^$/;

  public constructor(pExpected?: RegExp | RegExp[]) {
    super();
    if (pExpected) {
      this.expected = pExpected;
    }
  }
  public write(pChunk: string): boolean {
    if (Array.isArray(this.expected)) {
      for (const lExpectedRE of this.expected) {
        match(pChunk, lExpectedRE);
      }
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
      /Copyright \(c\) 2016-2026 Sander Verweij/,
    ]);
    const lErrorStream = new WritableTestStream();

    await cli(["node", "smcat.js", "--license"], {
      outStream: lOutStream,
      errorStream: lErrorStream,
    });
  });
});
