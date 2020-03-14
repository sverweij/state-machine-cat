const fs = require("fs");
const path = require("path");
const chai = require("chai");
const convert = require("../../src/parse/smcat/smcat-parser").parse;

const expect = chai.expect;

const $schema = require("../../src/parse/smcat-ast.schema.json");

chai.use(require("chai-json-schema"));

const FIXTURE_DIR = path.join(__dirname, "fixtures");
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter(pFileName => pFileName.endsWith(".smcat"))
  .map(pFileName => path.join(FIXTURE_DIR, pFileName));

describe("#parse smcat to json - ", () => {
  FIXTURE_INPUTS.forEach(pInputFixture => {
    it(`correctly parses ${path.basename(pInputFixture)} into json`, () => {
      const lResult = convert(fs.readFileSync(pInputFixture, "utf8"));

      expect(lResult).to.deep.equal(
        JSON.parse(
          fs.readFileSync(pInputFixture.replace(/\.smcat$/g, ".json"), "utf8")
        )
      );
      expect(lResult).to.jsonSchema($schema);
    });
  });
});
