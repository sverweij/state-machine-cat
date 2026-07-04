import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepEqual } from "node:assert/strict";
import convert from "#render/vector/vector-with-wasm.mjs";

/**
 * GraphViz is not deterministic with clustering, so we're going to skip these
 * in the tests.
 *
 * https://forum.graphviz.org/t/clustering-gives-undeterministic-results/989
 *
 * So having these guys as
 * @param pFileName
 * @returns
 */
function isDeterministic(pFileName: string): boolean {
  return Boolean(pFileName.match(/-d-/g));
}

const FIXTURE_DIR = fileURLToPath(new URL("../fixtures", import.meta.url));
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .filter((pFileName) => isDeterministic(pFileName))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#ast2svg-with-wasm - integration -", () => {
  for (const lInputFixture of FIXTURE_INPUTS) {
    it(`correctly converts ${path.basename(lInputFixture)} to svg`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(lInputFixture, "utf8")),
        { engine: "dot" },
      );

      deepEqual(
        lResult,
        fs.readFileSync(lInputFixture.replaceAll(/\.json$/g, ".svg"), "utf8"),
      );
    });
  }
});

describe("#ast2ps2-with-wasm - integration -", () => {
  for (const lInputFixture of FIXTURE_INPUTS) {
    it(`correctly converts ${path.basename(
      lInputFixture,
    )} to postscript`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(lInputFixture, "utf8")),
        { outputType: "oldps2" },
      );

      deepEqual(
        lResult,
        fs.readFileSync(lInputFixture.replaceAll(/\.json$/g, ".ps"), "utf8"),
      );
    });
  }
});

describe("#ast2eps-with-wasm - integration -", () => {
  for (const lInputFixture of FIXTURE_INPUTS) {
    it(`correctly converts ${path.basename(
      lInputFixture,
    )} to encapsulated postscript`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(lInputFixture, "utf8")),
        { outputType: "oldeps" },
      );

      deepEqual(
        lResult,
        fs.readFileSync(lInputFixture.replaceAll(/\.json$/g, ".eps"), "utf8"),
      );
    });
  }
});
