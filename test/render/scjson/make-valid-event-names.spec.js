const chai = require("chai");
const makeValidEventNames = require("~/src/render/scjson/make-valid-event-names");

const expect = chai.expect;

function checkExpectation(pExpectation, pValue) {
  const lValueToTest = makeValidEventNames(pValue);

  expect(lValueToTest).to.equal(pExpectation);
}

describe("#makeValidEventNames", () => {
  it("returns an empty when not passed a value", () => {
    checkExpectation("empty");
  });

  it('returns "empty" for null', () => {
    checkExpectation("empty", null);
  });

  it('returns "empty" for empty strings', () => {
    checkExpectation("empty", "");
  });

  it('start chars: smacks an "_" before valid NameChar, but invalid event start char (.)', () => {
    checkExpectation("_.", ".");
  });

  it("start chars: replaces start characters that are invalid NameChars", () => {
    checkExpectation("_", "]");
  });

  it("replaces any space likes with a regular space", () => {
    checkExpectation(
      "aap_noot_mies wim zus jet",
      "aap\t\t\tnoot mies\nwim\n\n\rzus\rjet"
    );
  });

  it("start chars: leaves valid NameStartChars alone", () => {
    checkExpectation(":", ":");
    checkExpectation("A", "A");
    checkExpectation("態", "態");
  });

  it("start chars: * are allowed", () => {
    checkExpectation("*", "*");
  });

  it("tail chars: leaves valid XML names alone", () => {
    checkExpectation("有限狀態機", "有限狀態機");
  });

  it("tail chars: replaces invalid NameChars", () => {
    checkExpectation("finite_state_machine", "finite state machine");
  });

  it("tail chars: * are allowed", () => {
    checkExpectation("error.*", "error.*");
  });

  it("smoke test", () => {
    checkExpectation(
      "3.little.小豬 有限._狀態機",
      "3.little.小豬\n有限.·狀態機\r\n"
    );
  });
});
