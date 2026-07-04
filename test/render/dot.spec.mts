import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepEqual } from "node:assert/strict";
import render from "#render/dot/index.mjs";

const FIXTURE_DIR = fileURLToPath(new URL("fixtures", import.meta.url));
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#render(dot) - integration - ", () => {
  for (const lInputFixture of FIXTURE_INPUTS) {
    it(`correctly converts ${path.basename(lInputFixture)} to dot`, () => {
      deepEqual(
        render(JSON.parse(fs.readFileSync(lInputFixture, "utf8"))),
        fs.readFileSync(lInputFixture.replaceAll(/\.json$/g, ".dot"), "utf8"),
      );
    });
  }
});
