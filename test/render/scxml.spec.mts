import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepStrictEqual } from "node:assert";
import convert from "../../src/render/scxml/index.mjs";

const FIXTURE_DIR = fileURLToPath(new URL("fixtures", import.meta.url));
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#ast2scxml - integration - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(pInputFixture)} to scxml`, () => {
      deepStrictEqual(
        convert(JSON.parse(fs.readFileSync(pInputFixture, "utf8"))),
        fs.readFileSync(pInputFixture.replace(/\.json$/g, ".scxml"), "utf8"),
      );
    });
  });
});
