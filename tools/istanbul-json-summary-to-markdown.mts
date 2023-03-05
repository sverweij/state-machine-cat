import { Readable, Writable } from "node:stream";

interface ICoverageMetric {
  pct: number;
  covered: number;
  total: number;
  skipped: number;
}

interface ICoverageSummary {
  total: {
    statements: ICoverageMetric;
    branches: ICoverageMetric;
    functions: ICoverageMetric;
    lines: ICoverageMetric;
  };
}

function formatMetric(pCoverageMetric: ICoverageMetric): string {
  return `${pCoverageMetric.pct.toFixed(1)}%|${pCoverageMetric.covered}/${
    pCoverageMetric.total
  }|${pCoverageMetric.skipped} skipped`;
}

function formatSummary(pCoverageSummary: ICoverageSummary): string {
  return (
    `|||||\n` +
    `|:--|--:|:--:|--:|\n` +
    `|**Statements**|${formatMetric(pCoverageSummary.total.statements)}|\n` +
    `|**Branches**|${formatMetric(pCoverageSummary.total.branches)}|\n` +
    `|**Functions**|${formatMetric(pCoverageSummary.total.functions)}|\n` +
    `|**Lines**|${formatMetric(pCoverageSummary.total.lines)}|\n`
  );
}

/**
 * Takes the output from the instanbul json-summary reporter (in a readStream),
 * formats it in a markdown table and writes it to the provided writeStream
 *
 * @param pStream stream to read the JSON from
 * @param pOutStream stream to write the markdown to
 */
function main(pInStream: Readable, pOutStream: Writable) {
  let lBuffer = "";

  pInStream
    .on("end", () => {
      pOutStream.write(formatSummary(JSON.parse(lBuffer) as ICoverageSummary));
      pOutStream.end();
    })
    .on(
      "error",
      /* c8 ignore start */
      (pError) => {
        process.stderr.write(`${pError}\n`);
      }
      /* c8 ignore stop */
    )
    .on("data", (pChunk) => {
      lBuffer += pChunk;
    });
}

main(process.stdin, process.stdout);
