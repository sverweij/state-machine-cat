import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepEqual, ok } from "node:assert/strict";
import render from "#render/dot/index.mjs";
import { parse } from "#parse/smcat/parse.mjs";

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

    describe("#render(dot) - transition width", () => {
      it("renders a zero width rather than using the default", () => {
        ok(render(parse("a => b [width=0];")).includes(" penwidth=0"));
      });
    });
  }
});
