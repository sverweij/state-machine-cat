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
        // "131", --> nested TODO
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
        // 500 hierarchic states c.s.
        // 600 is "the kitchensink"
        // BUNCH OF TODOS HERE
        // 700 parallel states
        "802",
        // "803", --> nested TODO
        "804",
        // "805", --> nested TODO
        // "806", --> nested TODO
        // "807", --> nested TODO
      ].includes(path.basename(pInputFixture).slice(0, 3))
    ) {
      it(`correctly converts ${path.basename(pInputFixture)} to dot`, () => {
        const lExpectedFileName = pInputFixture.replace(/\.json$/g, ".dot");
        const lExpected = fs.readFileSync(lExpectedFileName, "utf8");

        const lFixtureFileContents = fs.readFileSync(pInputFixture, "utf8");
        const lFixture = JSON.parse(lFixtureFileContents);
        const lFound = render(lFixture, {}, "  ");

        deepEqual(lFound, lExpected);
      });
    }
  });
});
