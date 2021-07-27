import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import { parse as convert } from "../../src/parse/smcat/smcat-parser.mjs";

import $schema from "../../src/parse/smcat-ast.schema.mjs";

use(chaiJSONSchema);

const FIXTURE_DIR = fileURLToPath(new URL("fixtures", import.meta.url));

const FIXTURE_INPUTS = readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".smcat"))
  .map((pFileName) => join(FIXTURE_DIR, pFileName));

describe("#parse smcat to json - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly parses ${basename(pInputFixture)} into json`, () => {
      const lResult = convert(readFileSync(pInputFixture, "utf8"));

      expect(lResult).to.deep.equal(
        JSON.parse(
          readFileSync(pInputFixture.replace(/\.smcat$/g, ".json"), "utf8")
        )
      );
      expect(lResult).to.jsonSchema($schema);
    });
  });
});
