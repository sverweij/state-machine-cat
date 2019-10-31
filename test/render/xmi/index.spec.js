const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const convert = require("../../../src/render/xmi");

const FIXTURE_DIR = path.join(__dirname, "../", "fixtures");
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter(f => f.endsWith(".json"))
  .map(f => path.join(FIXTURE_DIR, f));

describe("#ast2xmi - integration - ", () => {
  FIXTURE_INPUTS.forEach(pInputFixture => {
    it(`correctly converts ${path.basename(pInputFixture)} to xmi`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(pInputFixture, "utf8"))
      );
      expect(lResult.replace(/\r/g, "")).to.deep.equal(
        fs
          .readFileSync(pInputFixture.replace(/\.json$/g, ".xmi"), "utf8")
          .replace(/\r/g, "")
      );
    });
  });
});
