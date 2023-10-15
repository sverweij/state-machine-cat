import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { deepEqual } from "node:assert/strict";
import Ajv from "ajv";
import { parse as convert } from "#parse/smcat/smcat-parser.mjs";

import $schema from "#parse/smcat-ast.schema.mjs";

const ajv = new Ajv();

const FIXTURE_DIR = fileURLToPath(new URL("fixtures", import.meta.url));

const FIXTURE_INPUTS = readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".smcat"))
  .map((pFileName) => join(FIXTURE_DIR, pFileName));

describe("#parse smcat to json - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly parses ${basename(pInputFixture)} into json`, () => {
      const lResult = convert(readFileSync(pInputFixture, "utf8"));

      deepEqual(
        lResult,
        JSON.parse(
          readFileSync(pInputFixture.replace(/\.smcat$/g, ".json"), "utf8"),
        ),
      );
      ajv.validate($schema, lResult);
    });
  });
});
