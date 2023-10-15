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
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(pInputFixture)} to svg`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(pInputFixture, "utf8")),
        { engine: "dot" },
      );

      deepEqual(
        lResult,
        fs.readFileSync(pInputFixture.replace(/\.json$/g, ".svg"), "utf8"),
      );
    });
  });
});

describe("#ast2ps2-with-wasm - integration -", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(
      pInputFixture,
    )} to postscript`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(pInputFixture, "utf8")),
        { outputType: "oldps2" },
      );

      deepEqual(
        lResult,
        fs.readFileSync(pInputFixture.replace(/\.json$/g, ".ps"), "utf8"),
      );
    });
  });
});

describe("#ast2eps-with-wasm - integration -", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(
      pInputFixture,
    )} to encapsulated postscript`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(pInputFixture, "utf8")),
        { outputType: "oldeps" },
      );

      deepEqual(
        lResult,
        fs.readFileSync(pInputFixture.replace(/\.json$/g, ".eps"), "utf8"),
      );
    });
  });
});
