// eslint-disable-next-line security/detect-child-process
import { spawnSync } from "node:child_process";
import chai from "chai";
import chaiXML from "chai-xml";

const expect = chai.expect;

chai.use(chaiXML);

describe("e2e", () => {
  it("by default renders an svg from an smcat program", () => {
    const { status, stdout } = spawnSync("node", [
      "bin/smcat.js",
      "test/render/fixtures/600kitchensink.smcat",
      "-o",
      "-",
    ]);
    expect(status).to.equal(0);
    expect(stdout.toString("utf8")).to.contain("<svg ");
    expect(stdout.toString("utf8")).to.contain("</svg>");
  });
});
