import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepEqual, equal } from "node:assert/strict";
import Ajv from "ajv";
import $schema from "./scjson.schema.mjs";
import convert from "#render/scjson/index.mjs";

const ajv = new Ajv();

const FIXTURE_DIR = fileURLToPath(new URL("../fixtures", import.meta.url));
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#ast2scjson - ", () => {
  for (const lInputFixture of FIXTURE_INPUTS) {
    it(`correctly converts ${path.basename(lInputFixture)} to scjson`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(lInputFixture, "utf8")),
      );

      deepEqual(
        lResult,
        JSON.parse(
          fs.readFileSync(
            lInputFixture.replaceAll(/\.json$/g, ".scjson"),
            "utf8",
          ),
        ),
      );
      equal(ajv.validate($schema, lResult), true);
    });
  }
});
