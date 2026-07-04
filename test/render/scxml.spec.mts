import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepEqual } from "node:assert/strict";
import convert from "#render/scxml/index.mjs";

const FIXTURE_DIR = fileURLToPath(new URL("fixtures", import.meta.url));
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#render(scxml) - integration - ", () => {
  for (const lInputFixture of FIXTURE_INPUTS) {
    it(`correctly converts ${path.basename(lInputFixture)} to scxml`, () => {
      deepEqual(
        convert(JSON.parse(fs.readFileSync(lInputFixture, "utf8"))),
        fs.readFileSync(lInputFixture.replaceAll(/\.json$/g, ".scxml"), "utf8"),
      );
    });
  }
});
