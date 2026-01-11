import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { deepEqual, equal } from "node:assert/strict";
import { parse } from "#parse/smcat/parse.mjs";

import { validate } from "#parse/smcat-ast.validate.mjs";

const FIXTURE_DIR = fileURLToPath(new URL("fixtures", import.meta.url));

const FIXTURE_INPUTS = readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".smcat"))
  .map((pFileName) => join(FIXTURE_DIR, pFileName));

describe("#render(json) smcat to json - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly parses ${basename(pInputFixture)} into json`, () => {
      const lResult = parse(readFileSync(pInputFixture, "utf8"));

      deepEqual(
        lResult,
        JSON.parse(
          readFileSync(pInputFixture.replaceAll(/\.smcat$/g, ".json"), "utf8"),
        ),
      );
      equal(validate(lResult), true);
    });
  });
});
