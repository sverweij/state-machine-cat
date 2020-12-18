// eslint-disable-next-line security/detect-child-process
const { spawnSync } = require("child_process");
const chai = require("chai");

const expect = chai.expect;

chai.use(require("chai-xml"));

describe("e2e", () => {
  it("by default renders an svg from an smcat program", () => {
    const { status, stdout } = spawnSync("node", [
      "bin/smcat",
      "test/render/fixtures/600kitchensink.smcat",
      "-o",
      "-",
    ]);
    expect(status).to.equal(0);
    expect(stdout.toString("utf8")).to.contain("<svg ");
    expect(stdout.toString("utf8")).to.contain("</svg>");
  });
});
