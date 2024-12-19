import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepEqual } from "node:assert/strict";
import render from "#render/ndot/index.mjs";

const FIXTURE_DIR = fileURLToPath(new URL("fixtures", import.meta.url));
const FIXTURE_INPUTS = fs
  .readdirSync(FIXTURE_DIR)
  .filter((pFileName) => pFileName.endsWith(".json"))
  .map((pFileName) => path.join(FIXTURE_DIR, pFileName));

describe("#render(ndot) - integration - ", () => {
  FIXTURE_INPUTS.forEach((pInputFixture) => {
    if (
      [
        "000",
        "100",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        // ok
        "110",
        "111",
        "112",
        "113",
        "114",
        // ok
        "120",
        // ok
        "130",
        "131",
        "200",
        // ok
        "300",
        "301",
        "302",
        "303",
        "304",
        "305",
        "306",
        "307",
        "308",
        // 400 --> pseudo states
        "400", //join
        "401", // fork
        "402", // fork
        "403", // forkjoin
        "404", // junction
        "405", // junction
        "406", // choice
        "408", // terminate
        "500", // hierarchic states c.s.
        // "501", // because we now render transitions _inside_ the state
        "502",
        // ok
        "506",
        "510",
        // "511", // because we now render transitions _inside_ the state
        // "515", // because we now render transitions _inside_ the state & inevitably the order of the state declarations will be different
        // "516",// because we now render transitions _inside_ the state
        // 600 is "the kitchensink"
        // BUNCH OF TODOS HERE
        // 700 parallel states
        // "700", TODO - next ones to pick up
        "520",
        "521",
        "522",
        "523",
        "524",
        "540",
        "541",
        "542",
        "802",
        // "803", // because we now render transitions _inside_ the state
        "804",
        // "805", // because we now render transitions _inside_ the state
        // "806", // because we now render transitions _inside_ the state
        "807",
        // ok
        // 81x: notes
        "810",
        "811",
        "812",
        "813",
        "814",
        "815",
        "816",
        "817",
        "818",
        "819",
        "820",
        "821", // multi line note
      ].includes(path.basename(pInputFixture).slice(0, 3))
    ) {
      it(`correctly converts ${path.basename(pInputFixture)} to dot`, () => {
        const lExpectedFileName = pInputFixture.replace(/\.json$/g, ".dot");
        const lExpected = fs
          .readFileSync(lExpectedFileName, "utf8")
          .split("\n")
          .map((pLine) => pLine.trim())
          .join("\n");

        const lFixtureFileContents = fs.readFileSync(pInputFixture, "utf8");
        const lFixture = JSON.parse(lFixtureFileContents);
        const lFound = render(lFixture, {}, "  ")
          .split("\n")
          .map((pLine) => pLine.trim())
          .join("\n");

        deepEqual(lFound, lExpected);
      });
    }
  });
});
