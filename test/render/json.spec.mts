import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { deepStrictEqual } from "node:assert";
import Ajv from "ajv";
import { parse as convert } from "../../src/parse/smcat/smcat-parser.mjs";

import $schema from "../../src/parse/smcat-ast.schema.mjs";

const ajv = new Ajv();

const FIXTURE_DIR = fileURLToPath(new URL("fixtures", import.meta.url));

const FIXTURE_INPUTS = readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".smcat"))
  .map((pFileName) => join(FIXTURE_DIR, pFileName));

describe("#parse smcat to json - [a] ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly parses ${basename(pInputFixture)} into json`, () => {
      const lResult = convert(readFileSync(pInputFixture, "utf8"));

      deepStrictEqual(
        lResult,
        JSON.parse(
          readFileSync(pInputFixture.replace(/\.smcat$/g, ".json"), "utf8"),
        ),
      );
      ajv.validate($schema, lResult);
    });
  });
});
