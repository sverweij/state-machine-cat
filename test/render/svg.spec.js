const fs = require("fs");
const path = require("path");
const chai = require("chai");
const convert = require("../../src/render/svg");

const expect = chai.expect;

const FIXTURE_DIR = path.join(__dirname, "fixtures");
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#ast2svg - integration - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(pInputFixture)} to svg`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(pInputFixture, "utf8")),
        { engine: "dot" }
      );

      expect(lResult).to.deep.equal(
        fs.readFileSync(pInputFixture.replace(/\.json$/g, ".svg"), "utf8")
      );
    });
  });
});
