import { Writable } from "node:stream";
import { match } from "node:assert/strict";
import executeCLI from "#cli/execute-command-line.mjs";

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
      /Copyright \(c\) 2016-2024 Sander Verweij/,
    ]);
    const lErrorStream = new WritableTestStream();

    await executeCLI(["node", "smcat.js", "--license"], {
      outStream: lOutStream,
      errorStream: lErrorStream,
    });
  });

  it("shows an error on stdout when state-machine-cat doesn't support the node version", async () => {
    const lOutStream = new WritableTestStream();
    const lErrorStream = new WritableTestStream([
      /ERROR: your node version \(10.0.0\) is not recent enough./,
      /state-machine-cat is supported on node >=20/,
    ]);

    await executeCLI(["node", "smcat.js", "--license"], {
      outStream: lOutStream,
      errorStream: lErrorStream,
      currentNodeVersion: "10.0.0",
      supportedEngines: ">=20",
    });
  });
});
