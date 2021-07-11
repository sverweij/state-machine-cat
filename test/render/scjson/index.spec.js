import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chai, { expect } from "chai";
import chaiJsonSchema from "chai-json-schema";
import convert from "../../../src/render/scjson/index.js";
import { createRequireJSON } from "../../utl.js";

const requireJSON = createRequireJSON(import.meta.url);

const $schema = requireJSON("../../../src/render/scjson/scjson.schema.json");

chai.use(chaiJsonSchema);

const FIXTURE_DIR = fileURLToPath(new URL("../fixtures", import.meta.url));
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#ast2scjson - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(pInputFixture)} to scjson`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(pInputFixture, "utf8"))
      );

      expect(lResult).to.deep.equal(
        JSON.parse(
          fs.readFileSync(pInputFixture.replace(/\.json$/g, ".scjson"), "utf8")
        )
      );
      expect(lResult).to.jsonSchema($schema);
    });
  });
});
