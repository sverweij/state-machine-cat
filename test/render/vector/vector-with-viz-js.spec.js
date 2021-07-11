import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import convert from "../../../src/render/vector/vector-with-viz-js.js";

const FIXTURE_DIR = fileURLToPath(new URL("../fixtures", import.meta.url));
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#ast2svg-with-viz-js - integration - ", () => {
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

describe("#ast2ps2-with-viz-js - integration - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(
      pInputFixture
    )} to postscript`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(pInputFixture, "utf8")),
        { outputType: "oldps2" }
      );

      expect(lResult).to.deep.equal(
        fs.readFileSync(pInputFixture.replace(/\.json$/g, ".ps"), "utf8")
      );
    });
  });
});

describe("#ast2eps-with-viz-js - integration - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    it(`correctly converts ${path.basename(
      pInputFixture
    )} to encapsulated postscript`, () => {
      const lResult = convert(
        JSON.parse(fs.readFileSync(pInputFixture, "utf8")),
        { outputType: "oldeps" }
      );

      expect(lResult).to.deep.equal(
        fs.readFileSync(pInputFixture.replace(/\.json$/g, ".eps"), "utf8")
      );
    });
  });
});
