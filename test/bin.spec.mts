import { spawnSync } from "node:child_process";
import { equal } from "node:assert/strict";

describe("e2e", () => {
  it("by default renders an svg from an smcat program", () => {
    const { status, stdout } = spawnSync("node", [
      "dist/cli/main.mjs",
      "test/render/fixtures/600-kitchensink.smcat",
      "-o",
      "-",
    ]);
    equal(status, 0);
    equal(stdout.toString("utf8").includes("<svg"), true);
    equal(stdout.toString("utf8").includes("</svg>"), true);
  });
});
