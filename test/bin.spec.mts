import { spawnSync } from "node:child_process";
import { strictEqual } from "node:assert";

describe("e2e", () => {
  it("by default renders an svg from an smcat program", () => {
    const { status, stdout } = spawnSync("node", [
      "bin/smcat.mjs",
      "test/render/fixtures/600-kitchensink.smcat",
      "-o",
      "-",
    ]);
    strictEqual(status, 0);
    strictEqual(stdout.toString("utf8").includes("<svg"), true);
    strictEqual(stdout.toString("utf8").includes("</svg>"), true);
  });
});
