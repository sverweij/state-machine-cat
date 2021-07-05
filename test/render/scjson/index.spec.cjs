const fs = require("fs");
const path = require("path");
const chai = require("chai");
const convert = require("../../../src/render/scjson/index.cjs");

const expect = chai.expect;

const $schema = require("../../../src/render/scjson/scjson.schema.json");

chai.use(require("chai-json-schema"));

const FIXTURE_DIR = path.join(__dirname, "../", "fixtures");
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
