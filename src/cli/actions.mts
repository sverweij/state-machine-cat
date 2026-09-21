import type { Readable, Writable } from "node:stream";
import { render } from "../index-node.mjs";
import { getOutStream, getInStream } from "./file-name-to-stream.mjs";
import type { ICLIRenderOptions } from "./cli-types.mjs";

const LICENSE = `
    state machine cat - write beautiful state charts

The MIT License (MIT)

Copyright (c) 2016-2026 Sander Verweij

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject
to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

`;

const MAX_INPUT_BYTES = 4_194_304; // 4Mb
const ONE_MEGA_BYTE = 1_048_576;
// Output types graphviz emits as binary. For these the render result is a
// latin1 ('binary') string of raw bytes, which has to be written back out as
// such. Everything else is text, and writing it as latin1 mangles any
// non-ASCII in it (an em dash would end up as a single 0x14 byte).
const BINARY_OUTPUT_TYPES: Set<string> = new Set(["png", "pdf"]);

function getStream(pStream: Readable): Promise<string> {
  return new Promise((pResolve, pReject) => {
    let lInputString = "";
    let lInputLength = 0;

    pStream
      .on("data", (pChunk) => {
        lInputLength += Buffer.byteLength(pChunk);
        if (lInputLength > MAX_INPUT_BYTES) {
          pStream.destroy(
            new Error(
              `\n  Input exceeds maximum sane size of ${Math.round(MAX_INPUT_BYTES / ONE_MEGA_BYTE)} Mb. Cowardly refusing to continue.\n`,
            ),
          );
        } else {
          lInputString += pChunk;
        }
      })
      .on("error", pReject)
      .on("end", () => {
        pResolve(lInputString);
      });
  });
}
export function displayLicense(pOutStream: Writable): void {
  pOutStream.write(LICENSE, "utf8");
}

export function transform(
  pOptions: ICLIRenderOptions,
): Promise<boolean | string> {
  return getStream(getInStream(pOptions.inputFrom)).then(async (pInput) => {
    const lOutput = await render(pInput, {
      inputType: pOptions.inputType,
      outputType: pOptions.outputType,
      engine: pOptions.engine,
      direction: pOptions.direction,
      dotGraphAttrs: pOptions.dotGraphAttrs,
      dotNodeAttrs: pOptions.dotNodeAttrs,
      dotEdgeAttrs: pOptions.dotEdgeAttrs,
      labelGap: pOptions.labelGap,
      desugar: pOptions.desugar,
    });

    return getOutStream(pOptions.outputTo).write(
      typeof lOutput === "string"
        ? lOutput
        : JSON.stringify(lOutput, null, "    "),
      BINARY_OUTPUT_TYPES.has(pOptions.outputType) ? "binary" : "utf8",
    );
  });
}
/* oxlint-disable explicit-module-boundary-types, no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(pError: any): string {
  if (pError.location) {
    return `\n  syntax error on line ${pError.location.start.line}, column ${pError.location.start.column}:\n  ${pError.message}\n\n`;
  }
  return pError.message;
}
