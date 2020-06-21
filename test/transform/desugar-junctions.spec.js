const chai = require("chai");
const utl = require("./utl");
const desugar = require("~/src/transform/desugar");

const expect = chai.expect;

describe("transform/desugar - junctions", () => {
  it("leaves empty state machines alone", () => {
    const EMPTY_MACHINE = { states: [] };

    expect(desugar(EMPTY_MACHINE)).to.deep.equal(EMPTY_MACHINE);
  });

  it("leaves state machines without pseudo states alone", () => {
    const JUNCTIONLESS = utl.readFixture("noforknojoin.json");

    expect(desugar(JUNCTIONLESS)).to.deep.equal(JUNCTIONLESS);
  });

  it("replaces a single junctions with the transitions they represent", () => {
    const WITHJUNCTION = utl.readFixture("junction.json");
    const WITHOUTJUNCTION = utl.readFixture("junction.desugared.json");

    expect(desugar(WITHJUNCTION)).to.deep.equal(WITHOUTJUNCTION);
  });

  it("replaces a multiple junctions with the transitions they represent", () => {
    const WITHJUNCTION = utl.readFixture("junctions.json");
    const WITHOUTJUNCTION = utl.readFixture("junctions.desugared.json");

    expect(desugar(WITHJUNCTION)).to.deep.equal(WITHOUTJUNCTION);
  });
});
