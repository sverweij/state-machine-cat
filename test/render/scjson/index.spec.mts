import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepEqual } from "node:assert/strict";
import Ajv from "ajv";
import convert from "../../../src/render/scjson/index.mjs";
import $schema from "./scjson.schema.mjs";

const ajv = new Ajv();

const FIXTURE_DIR = fileURLToPath(new URL("../fixtures", import.meta.url));
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#ast2scjson - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(pInputFixture)} to scjson`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(pInputFixture, "utf8")),
      );

      deepEqual(
        lResult,
        JSON.parse(
          fs.readFileSync(pInputFixture.replace(/\.json$/g, ".scjson"), "utf8"),
        ),
      );
      ajv.validate($schema, lResult);
    });
  });
});
